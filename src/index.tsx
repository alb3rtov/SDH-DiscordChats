import {
  definePlugin,
  Field,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  Router,
  DialogButton,
  ButtonItem,
} from "decky-frontend-lib";
import React, { VFC, useState, useEffect } from "react";
import { FaDiscord, FaDotCircle, FaCircle, FaMoon, FaMinusCircle } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  const [connectedFriends, setConnectedFriends] = useState(1);
  const [disconnectedFriends, setDisconnectedFriends] = useState(2);
  const [login, setLogin] = useState<number>(0);

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

  const get_login_status = async () => {
    const result = await serverAPI!.callPluginMethod("get_login", {});
    console.log("Esto del useeffect: "+ result.result)
    if (result.success) {
      setLogin(result.result as number)
    }
  }

  const set_login_status = async (status: number) => {
    await serverAPI!.callPluginMethod("set_login", {"status":status});
    setLogin(status as number)
    console.log(login)
  }

  useEffect(() => {
    get_login_status();
  }, []);

  const Sessions = (
    <PanelSectionRow style={{ fontSize: "12px", marginBottom: "10px", marginLeft: "20px"}}>
     There is an active session, wait for it to close and try again later.
    </PanelSectionRow>
  );

  const Login = (
    <PanelSection title="Login">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            set_login_status(1);
            start_bot();
          }}
        >
          Login with token
        </ButtonItem>
      </PanelSectionRow>

    </PanelSection>
  );

  const Chats = (
    
    <PanelSection title="Friends">


      <PanelSection title={`Online (${connectedFriends})`}>
        <PanelSectionRow>
          <Field focusable={true} icon={<FaCircle size={10} color="#43b581"/>} label="Friend connected 1" description="Online" onClick={() => {test_print()}}>

          </Field>
          <Field focusable={true} icon={<FaMoon size={10} color="#faa61a"/>} label="Friend connected 2" description="Idle" onClick={() => {test_print()}}>

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
      <PanelSection title="Logout">
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            set_login_status(0);
            stop_bot();
          }}
        >
          Logout
        </ButtonItem>
      </PanelSectionRow>

    </PanelSection>
    </PanelSection>
    
  );

  return (
    <React.Fragment>
      {login == 0 && Login}
      {login == 0 && Sessions}
      {login == 1 && Chats}
    </React.Fragment>
  );
};

const DeckyPluginRouterTest: VFC = () => {
  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      Hello World!
      <DialogButton onClick={() => Router.NavigateToLibraryTab()}>
        Go to Library
      </DialogButton>
    </div>
  );
};

export default definePlugin((serverApi: ServerAPI) => {

  serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
    exact: true,
  });

  return {
    title: <div className={staticClasses.Title}>Discord Chats</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaDiscord />,
    onDismount() {
      serverApi.routerHook.removeRoute("/decky-plugin-test");
    },
  };
});
