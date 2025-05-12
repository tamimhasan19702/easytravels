/** @format */
import DashboardLayout from "@/components/DashboardLayout";
import { useMessaging } from "@/context/MessagingContext";
import { useUser } from "@/context/UserContext";
import { useParams } from "react-router-dom";
const UserMessage = () => {
  const { tripId, agencyId } = useParams();
  const { user } = useUser();
  const { messages, messageRoomId, initMessageRoom, sendMessage, error } =
    useMessaging();

  return (
    <DashboardLayout>
      <div>UserMessage</div>
      <p>{tripId}</p>
      <p>{agencyId}</p>
    </DashboardLayout>
  );
};

export default UserMessage;
