<a href="https://watty.nu/"><img src="https://user-images.githubusercontent.com/3383006/200322186-19210182-ada6-432f-af2e-48a33af38f52.jpg" alt="drawing" width="200"/></a>


Watty is a home automation platform built on top of [Shelly](https://shelly-api-docs.shelly.cloud/) and [Tibber's](https://developer.tibber.com/) APIs.

If you are tracking your power consumption with one of Shelly's devices (like their smart plugs), and your power company of choice is Tibber, you can use Watty
to automatically calculate how much an electric device costs you.

You need two things for this to work: an API token from Shelly, and an API token from Tibber.

The Shelly token is located in their mobile application:
Settings -> User Settings -> Authorization Cloud Key -> Get key

The Tibber token is retrieved from their API website: https://developer.tibber.com/
Click "Sign In" in the top right corner.
When signed in, copy the access token found here: https://developer.tibber.com/settings/access-token

With these two tokens, you can "log in" to Watty and see how much the selected device costs you in NOK.

<b>NOTICE:</b> Watty is experimental, and does not guarantee that the calculated costs are correct. Watty does not include your "nettleie" (network rent cost); this is something
you have to calculate your self.
