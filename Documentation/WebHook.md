# Introduction
Like every system, KiboSupport Webhook is implemented as a REST Post request. It stays there as open REST URI but it only approves
the request if it was made from CloudKibo droplet. It only allows the IP address of CloudKibo droplet.

When KiboSupport generates conference URL for agent and visitor, it adds the company id, request id, agent and visitor information into
the URL. CloudKibo then extracts this information from this URL.

CloudKibo server sends each chat message to Post route of KiboSupport which checks the valid IP address and then saves it.

Chat message contains following information:

1: to 

2: from

3: agentemail 

4: visitoremail

5: msg

6: datetime

7: request_id

8: companyid

# WebHooks Diagram

![WebHooks Diagram](https://github.com/Cloudkibo/KiboSupport/blob/master/Kibosupport_documentary/webhooks.png)
