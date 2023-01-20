import rabbit from 'foo-foo-mq';
import { CONTENT_TYPE_APP_JSON } from "../../utils/constants/common.string.constants";
import { UsersMsEventsConstants } from "../../utils/constants/users-ms.events.constants";

export function onMyEvent (event: rabbit.Message<object>) {
  console.log('received event', { event });

  // here, we could do database things if we wanted
  
  setTimeout(() => {
    event.ack();

    rabbit.publish(process.env.RABBIT_MQ_USERS_EXCHANGE, {
      type: UsersMsEventsConstants.MY_EVENT_PROCESSED,
      body: { message: `finished processing` },
      contentType: CONTENT_TYPE_APP_JSON,
    });
  }, 3000);
}