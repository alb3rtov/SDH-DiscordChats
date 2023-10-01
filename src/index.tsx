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

type DictType = { [key: string]: string };

const Content: VFC<{ serverAPI: ServerAPI }> = ({serverAPI}) => {
  const [serverName, setServerName] = useState<string>("");
  const [channels, setChannels] = useState<DictType>({});
  const [onlineMembers, setOnlineMembers] = useState<DictType>({});
  const [offlineMembers, setOfflineMembers] = useState<DictType>({});
  const [login, setLogin] = useState(0);
  
  /*
  const test_print = async () => {
    console.log("This is a test")
    setConnectedFriends(20);
    setDisconnectedFriends(50);
  }*/

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

  const get_channels = async () => {
    const result = await serverAPI!.callPluginMethod("get_channels", {});
    if (result.success) {
      setChannels(result.result as DictType)
    }
  }  
  
  const get_channels_m = async () => {
    const result = await serverAPI!.callPluginMethod("get_channels_m", {});
    if (result.success) {
      setChannels(result.result as DictType)
    }
  }
  
  const get_online_members = async () => {
    const result = await serverAPI!.callPluginMethod("get_online_members", {});
    if (result.success) {
      setOnlineMembers(result.result as DictType)
    }
  }

  const get_offline_members = async () => {
    const result = await serverAPI!.callPluginMethod("get_offline_members", {});
    if (result.success) {
      setOfflineMembers(result.result as DictType)
    }
  }  

  /*
  const send_message_to_user = async () => {
    await serverAPI!.callPluginMethod("send_message_to_user", {});
  } */

  useEffect(() => {
    get_login_status();
  }, []);

  useEffect(() => {
    if (login == 1) {
      get_server_name_m();
      get_channels_m();
      if (serverName == "") {
        setTimeout(()=>{
          get_server_name();
          get_channels();
          get_online_members();
          get_offline_members();
        }, 4000)
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


  const Channels = (
    <PanelSection title="Channels">
      <PanelSectionRow>
        {Object.entries(channels).map(([key, name]) => (
          <Field key={key} focusable={true} label={name}></Field>
        ))}
        </PanelSectionRow>
    </PanelSection>
  );  
  
  function getStatusIcon(status : string) {
    switch (status) {
      case "Online":
        return <FaCircle size={10} color="#43b581" />;
      case "Idle":
        return <FaMoon size={10} color="#faa61a" />;
      case "Do Not Disturb":
        return <FaMinusCircle size={10} color="#f04747" />;
      case "Offline":
        return <FaDotCircle size={10} color="#747f8d" />; 
      default:
        return null;
    }
  }

  const OnlineMembers = (
      <PanelSection title={"Online (" + Object.keys(onlineMembers).length + ")"}>
        <PanelSectionRow>
        {Object.entries(onlineMembers).map(([key, name]) => {
          const [userName, status] = name.split(';');
          const icon = getStatusIcon(status); 
          return (
            <Field key={key} icon={icon} focusable={true} label={userName} description={status}></Field>
          );
        })}
          </PanelSectionRow>
      </PanelSection>
  );

  const OfflineMembers = (
      <PanelSection title={"Offline (" + Object.keys(offlineMembers).length + ")"}>
        <PanelSectionRow>
        {Object.entries(offlineMembers).map(([key, name]) => {
          const icon = getStatusIcon("Offline"); 
          return (
            <Field key={key} icon={icon} focusable={true} label={name} description="Offline"></Field>
          );
        })}
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
      {Channels}
      {OnlineMembers}
      {OfflineMembers}
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
