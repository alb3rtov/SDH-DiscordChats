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

import logo from "../assets/logo3.png";

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  const [connectedFriends, setConnectedFriends] = useState(1);
  const [disconnectedFriends, setDisconnectedFriends] = useState(2);
  const [serverName, setServerName] = useState<string>("");
  const [login, setLogin] = useState(0);
  
  const test_print = async () => {
    console.log("This is a test")
    setConnectedFriends(20);
    setDisconnectedFriends(50);
  }

  const stop_bot = async () => {
    setLogin(2);
    serverAPI!.callPluginMethod("stop_bot", {});
  }

  const start_bot = async () => {
    await serverAPI!.callPluginMethod("start_bot", {});
  }

  const get_login_status = async () => {
    const result = await serverAPI!.callPluginMethod("get_login", {});
    if (result.success) {
      setLogin(result.result as number)
    }
  }

  const set_login_status = async (status: number) => {
    await serverAPI!.callPluginMethod("set_login", {"status":status});
    setLogin(status as number)
  }

  const get_server_name = async () => {
    const result = await serverAPI!.callPluginMethod("get_server_name", {});
    if (result.success) {
      setServerName(result.result as string)
    }
  }

  const get_server_name_m = async () => {
    const result = await serverAPI!.callPluginMethod("get_server_name_m", {});
    if (result.success) {
      setServerName(result.result as string)
    }
  }  
  
  const send_message_to_user = async () => {
    await serverAPI!.callPluginMethod("send_message_to_user", {});
  }  

  useEffect(() => {
    get_login_status();
  }, []);

  useEffect(() => {
    if (login == 1) {
      get_server_name_m();
      if (serverName == "") {
        setTimeout(()=>{get_server_name();}, 4000)
      }
    }
  }, [login]);

  const Sessions = (
    <PanelSectionRow style={{ fontSize: "13px", marginLeft: "18px", marginRight: "18px", marginBottom: "20px"}}>
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


  const MembersOnline = (
      <PanelSection title={`Online (${connectedFriends})`}>
        <PanelSectionRow>
          <Field focusable={true} icon={<FaCircle size={10} color="#43b581"/>} label="Friend connected 1" description="Online" onClick={() => {send_message_to_user()}}></Field>
          <Field focusable={true} icon={<FaMoon size={10} color="#faa61a"/>} label="Friend connected 2" description="Idle" onClick={() => {test_print()}}></Field>
          <Field focusable={true} icon={<FaMinusCircle size={10} color="#f04747"/>} label="Friend connected 3" description="Do Not Disturb" onClick={() => {test_print()}}></Field>
          <Field focusable={true} icon={<FaCircle size={10} color="#d522f5"/>} label="Friend connected 4" description="Streaming" onClick={() => {test_print()}}></Field>
        </PanelSectionRow>
      </PanelSection>
  );

  const MembersOffline = (
      <PanelSection title={`Offline (${disconnectedFriends})`}>
        <PanelSectionRow>
          <Field focusable={true} icon={<FaDotCircle size={10} color="#747f8d"/>} label="Friend disconnected 1" description="Offline" onClick={() => {test_print()}}></Field>
          <Field focusable={true} icon={<FaDotCircle size={10} color="#747f8d"/>} label="Friend disconnected 2" description="Offline" onClick={() => {test_print()}}></Field>
          <Field focusable={true} icon={<FaDotCircle size={10} color="#747f8d"/>} label="Friend disconnected 3" description="Offline" onClick={() => {test_print()}}></Field>
          <Field focusable={true} icon={<FaDotCircle size={10} color="#747f8d"/>} label="Friend disconnected 4" description="Offline" onClick={() => {test_print()}}></Field>
          </PanelSectionRow>
      </PanelSection>
  );  

  const LogOut = (
    <PanelSection title="Logout">
    <PanelSectionRow>
      <ButtonItem
        layout="below"
        onClick={() => {
          stop_bot();
        }}
      >
        Logout
      </ButtonItem>
    </PanelSectionRow>

  </PanelSection>
  );

  const ServerChats = (
    <PanelSection title={`Server: ${serverName}`}>
      {MembersOnline}
      {MembersOffline}
      {LogOut}
    </PanelSection>
  );
  
  const Logo = (
    <PanelSectionRow>
      <div style={{ display: "flex", justifyContent: "center"}}>
        <img src={logo}  style={{ maxWidth: "25%", maxHeight: "25%" }} />
      </div>
    </PanelSectionRow>
  );
  

  return (
    <React.Fragment >
      {login == 0 && Login}
      {login == 0 && Logo}

      {login == 2 && Sessions}
      {login == 2 && Logo}

      {login == 1 && ServerChats}
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
