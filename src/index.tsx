import {
  definePlugin,
  Field,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
} from "decky-frontend-lib";
import { VFC, useState } from "react";
import { FaDiscord, FaDotCircle, FaCircle, FaMoon, FaMinusCircle } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  const [connectedFriends, setConnectedFriends] = useState(1);
  const [disconnectedFriends, setDisconnectedFriends] = useState(2);

  const test_print = async () => {
    console.log("This is a ...")

    setConnectedFriends(20);
    setDisconnectedFriends(50);
  }

  const stop_bot = async () => {
    const result = await serverAPI!.callPluginMethod("stop_bot", {});
    console.log(result)
  }

  const start_bot = async () => {
    const result = await serverAPI!.callPluginMethod("start_bot", {});
    console.log(result)
  }

  return (
    <PanelSection title="Friends">
      <PanelSection title={`Online (${connectedFriends})`}>
        <PanelSectionRow>
          <Field focusable={true} icon={<FaCircle size={10} color="#43b581"/>} label="Friend connected 1" description="Online" onClick={() => {stop_bot()}}>

          </Field>
          <Field focusable={true} icon={<FaMoon size={10} color="#faa61a"/>} label="Friend connected 2" description="Idle" onClick={() => {start_bot()}}>

          </Field>
          <Field focusable={true} icon={<FaMinusCircle size={10} color="#f04747"/>} label="Friend connected 3" description="Do Not Disturb" onClick={() => {test_print()}}>

          </Field>
          <Field focusable={true} icon={<FaCircle size={10} color="#d522f5"/>} label="Friend connected 4" description="Streaming" onClick={() => {test_print()}}>

          </Field>

        </PanelSectionRow>
      </PanelSection>
     
      <PanelSection title={`Disconnected (${disconnectedFriends})`}>
        <PanelSectionRow>
          <Field focusable={true} icon={<FaDotCircle size={10} color="#747f8d"/>} label="Friend disconnected 1" description="Offline" onClick={() => {test_print()}}></Field>
          <Field focusable={true} icon={<FaDotCircle size={10} color="#747f8d"/>} label="Friend disconnected 2" description="Offline" onClick={() => {test_print()}}></Field>
          <Field focusable={true} icon={<FaDotCircle size={10} color="#747f8d"/>} label="Friend disconnected 3" description="Offline" onClick={() => {test_print()}}></Field>
          <Field focusable={true} icon={<FaDotCircle size={10} color="#747f8d"/>} label="Friend disconnected 4" description="Offline" onClick={() => {test_print()}}></Field>
          </PanelSectionRow>

      </PanelSection>

    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {


  return {
    title: <div className={staticClasses.Title}>Discord Chats</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaDiscord />,
    onDismount() {
      serverApi.routerHook.removeRoute("/decky-plugin-test");
    },
  };
});
