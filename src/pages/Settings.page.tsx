import { Button, Loader, Select, Stack } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconArrowBack, IconCheck } from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWattyEndpoint } from '../api/watty.service';
import { useAuthContext } from '../context/auth.context';

const SettingsPage: FC = () => {
  const navigate = useNavigate();
  const { tokens } = useAuthContext();
  const { getSettings, updateSettings, getFylker, getGridCompanies } = useWattyEndpoint();
  const queryClient = useQueryClient();

  const [gridCompanySearch, setGridCompanySearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(gridCompanySearch, 300);

  const form = useForm({
    initialValues: {
      fylkeNr: '',
      fylkeNavn: '',
      organisasjonsNr: '',
      organisasjonsNavn: ''
    },
    validate: {
      fylkeNr: isNotEmpty('Select a fylke'),
      organisasjonsNr: isNotEmpty('Select a grid company')
    }
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['WATTY', 'SETTINGS'],
    queryFn: getSettings,
    enabled: Boolean(tokens.wattyToken)
  });

  const { data: fylker } = useQuery({
    queryKey: ['LOOKUP', 'FYLKE'],
    queryFn: () => getFylker()
  });

  const selectedGridCompanyLabel =
    form.values.organisasjonsNr && form.values.organisasjonsNavn
      ? `${form.values.organisasjonsNavn} (${form.values.organisasjonsNr})`
      : form.values.organisasjonsNavn || form.values.organisasjonsNr || '';

  const { data: gridCompanies, isLoading: gridCompanyLoading } = useQuery({
    queryKey: ['LOOKUP', 'GRID-COMPANY', debouncedSearch],
    queryFn: () => getGridCompanies(debouncedSearch),
    enabled:
      debouncedSearch.length >= 2 &&
      debouncedSearch !== form.values.organisasjonsNavn &&
      debouncedSearch !== selectedGridCompanyLabel
  });

  useEffect(() => {
    if (!tokens.wattyToken) {
      navigate('/');
      return;
    }
  }, [tokens.wattyToken, navigate]);

  useEffect(() => {
    if (settings) {
      form.setValues({
        fylkeNr: settings.fylkeNr ?? '',
        fylkeNavn: settings.fylkeNavn ?? '',
        organisasjonsNr: settings.organisasjonsNr ?? '',
        organisasjonsNavn: settings.organisasjonsNavn ?? ''
      });
    }
  }, [settings]);

  const fylkeOptions = fylker?.map((f) => ({ value: f.fylkesnummer, label: f.fylkesnavn })) ?? [];

  const gridCompanyOptions =
    gridCompanies?.map((c) => ({
      value: c.organisasjonsnummer,
      label: `${c.navn} (${c.organisasjonsnummer})`,
      navn: c.navn
    })) ?? [];

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await updateSettings({
        fylkeNr: values.fylkeNr,
        fylkeNavn: values.fylkeNavn,
        organisasjonsNr: values.organisasjonsNr,
        organisasjonsNavn: values.organisasjonsNavn
      });
      queryClient.invalidateQueries({ queryKey: ['WATTY', 'SETTINGS'] });
      showNotification({
        icon: <IconCheck size={18} />,
        color: 'green',
        title: 'Settings saved',
        message: 'Your settings have been updated.'
      });
    } catch {
      showNotification({
        color: 'red',
        title: 'Error',
        message: 'Failed to save settings.'
      });
    }
  });

  if (!tokens.wattyToken) return null;

  if (settingsLoading) return <Loader />;

  const backToDevices = () => {
    const deviceId = localStorage.getItem('device');
    navigate(deviceId ? `/devices/${deviceId}` : '/devices');
  };

  return (
    <Stack maw={400} mx="auto" mt="xl">
      <Button onClick={backToDevices} leftSection={<IconArrowBack />} variant="subtle" style={{ alignSelf: 'flex-start' }}>
        Back
      </Button>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Select
            label="Fylke"
            placeholder="Select fylke"
            data={fylkeOptions}
            searchable
            required
            {...form.getInputProps('fylkeNr')}
            onChange={(value) => {
              const option = fylkeOptions.find((o) => o.value === value);
              form.setFieldValue('fylkeNr', value ?? '');
              form.setFieldValue('fylkeNavn', option?.label ?? '');
            }}
          />

          <Select
            label="Grid company (nettleie)"
            placeholder="Type to search for grid company"
            required
            data={
              form.values.organisasjonsNr && !gridCompanyOptions.some((o) => o.value === form.values.organisasjonsNr)
                ? [
                    {
                      value: form.values.organisasjonsNr,
                      label:
                        form.values.organisasjonsNavn && form.values.organisasjonsNr
                          ? `${form.values.organisasjonsNavn} (${form.values.organisasjonsNr})`
                          : form.values.organisasjonsNavn || form.values.organisasjonsNr
                    },
                    ...gridCompanyOptions
                  ]
                : gridCompanyOptions
            }
            searchable
            searchValue={gridCompanySearch}
            onSearchChange={setGridCompanySearch}
            onDropdownClose={() => setGridCompanySearch('')}
            nothingFoundMessage={
              gridCompanySearch.length < 2
                ? 'Type at least 2 characters to search'
                : gridCompanySearch !== debouncedSearch || gridCompanyLoading
                  ? 'Searching...'
                  : 'No companies found'
            }
            {...form.getInputProps('organisasjonsNr')}
            onChange={(value) => {
              const option = gridCompanyOptions.find((o) => o.value === value);
              form.setFieldValue('organisasjonsNr', value ?? '');
              form.setFieldValue('organisasjonsNavn', option?.navn ?? '');
            }}
          />

          <Button type="submit">Save</Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default SettingsPage;

