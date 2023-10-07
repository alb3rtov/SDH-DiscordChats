import {
  definePlugin,
  Field,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  Router,
//DialogButton,
  TextField,
  useParams,
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
  const [loginStarted, setLoginStarted] = useState(0);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  const close_session = async () => {
    setLogin(2);
    serverAPI!.callPluginMethod("close_session", {});
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

  /*
  const set_login_status = async (status: number) => {
    await serverAPI!.callPluginMethod("set_login", {"status":status});
    setLogin(status as number)
  }*/

  const get_server_name = async (api : number) => {
    const result = await serverAPI!.callPluginMethod("get_server_name", {"flag":api});
    if (result.success) {
      setServerName(result.result as string)
    }
  }

  const get_channels = async (api : number) => {
    const result = await serverAPI!.callPluginMethod("get_channels", {"flag":api});
    if (result.success) {
      setChannels(result.result as DictType)
    }
  }  
  
  const get_online_members = async (api : number) => {
    const result = await serverAPI!.callPluginMethod("get_online_members", {"flag":api});
    if (result.success) {
      setOnlineMembers(result.result as DictType)
    }
  }  

  const get_offline_members = async (api : number) => {
    const result = await serverAPI!.callPluginMethod("get_offline_members", {"flag":api});
    if (result.success) {
      setOfflineMembers(result.result as DictType)
    }
  }



  useEffect(() => {
    get_login_status();
  }, []);

  useEffect(() => {
    if (login == 1) {
      get_server_name(0);
      get_channels(0);
      get_online_members(0);
      get_offline_members(0);

      setLoadingData(true)
      setTimeout(()=>{
        get_server_name(1);
        get_channels(1);
        get_online_members(1);
        get_offline_members(1);
        setLoadingData(false)
      }, 2000)
    }
  }, [login]);

  const TokenError = (
    <PanelSectionRow style={{ fontSize: "13px", marginLeft: "18px", marginRight: "18px", marginBottom: "20px"}}>
     The token used is not correct. Make sure that the token corresponds to the bot you have created. When it is fixed, reinstall the plugin.
    </PanelSectionRow>
  );

  const TokenFileError = (
    <PanelSectionRow style={{ fontSize: "13px", marginLeft: "18px", marginRight: "18px", marginBottom: "20px"}}>
     The token file was not found, make sure it is in the directory /home/deck/homebrew/services/token.txt. When it is fixed, reinstall the plugin.
    </PanelSectionRow>
  );

  const Sessions = (
    <PanelSectionRow style={{ fontSize: "13px", marginLeft: "18px", marginRight: "18px", marginBottom: "20px"}}>
     There is an active session, wait for it to close and try again later.
    </PanelSectionRow>
  );

  const Login = (
    <PanelSection title="Login" spinner={login === 0 && loginStarted === 1}>
      <PanelSectionRow>
        <ButtonItem
          layout="below"
          onClick={() => {
            start_bot();
            setLoginStarted(1)
            setTimeout(() => {
              get_login_status();
            }, 3000);
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
          <Field 
            key={key} 
            focusable={true} 
            label={name} 
            onClick={() => {
              Router.Navigate(`/discordchat/${name}/${key}`);
              Router.CloseSideMenus();
            }}>
          </Field>
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
            <Field 
              key={key} 
              icon={icon} 
              focusable={true} 
              label={userName} 
              description={status}
              onClick={() => {
                Router.Navigate(`/discordchat/${userName}/${key}`);
                Router.CloseSideMenus();
              }}>
            </Field>
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
            <Field 
              key={key} 
              icon={icon} 
              focusable={true} 
              label={name} 
              description="Offline"
              onClick={() => {
                Router.Navigate(`/discordchat/${name}/${key}`);
                Router.CloseSideMenus();
              }}>
            </Field>
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
          close_session();
        }}
      >
        Logout
      </ButtonItem>
    </PanelSectionRow>

  </PanelSection>
  );

  const ServerChats = (
    <PanelSection title={`Server: ${serverName}`} spinner={loadingData}>
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

      {login == 3 && TokenFileError}
      {login == 3 && Logo}

      {login == 4 && TokenError}
      {login == 4 && Logo}
    </React.Fragment>
  );
};



const Chat: VFC<{ serverAPI: ServerAPI }> = ({serverAPI})  => {

  const send_message_to_user = async (id: string, msg: string) => {
    await serverAPI!.callPluginMethod("send_message_to_user", {'id':id,'msg':msg});
  }

  const { chatname, id } = useParams<{ chatname: string, id: string }>();
  const [message, setMessage] = useState("")
  return (
    <div style={{ marginTop: "50px", color: "white" }}>
      <Field label={`${chatname}`} ></Field>

      <TextField
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />

      <ButtonItem
        layout="below"
        onClick={() => {
          setMessage("")
          send_message_to_user(id, message);
        }}
      >
        Send
      </ButtonItem>
    </div>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  serverApi.routerHook.addRoute("/discordchat/:chatname/:id", () => (
    <Chat serverAPI={serverApi}/>
  ), {
    exact: true,
  });

  return {
    title: <div className={staticClasses.Title}>Discord Chats</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaDiscord />,
    onDismount() {
      serverApi.routerHook.removeRoute("/discordchat/:id");
    },
  };
});
