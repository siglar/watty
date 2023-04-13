import { Box, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import { FC } from 'react';

interface PasswordRequirementProps {
  meets: boolean;
  label: string;
}

const PasswordRequirement: FC<PasswordRequirementProps> = (props: PasswordRequirementProps) => {
  const { meets, label } = props;

  return (
    <Text color={meets ? 'teal' : 'red'} sx={{ display: 'flex', alignItems: 'center' }} mt={7} size="sm">
      {meets ? <IconCheck size={14} /> : <IconX size={14} />} <Box ml={10}>{label}</Box>
    </Text>
  );
};

export default PasswordRequirement;
