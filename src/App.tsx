import ChatBotForm from "./components /chatForm";
import RivePlayer from "./components /rivePlayer";
import biscuit from "./assets/biscuit.svg?url";
function App() {
  return (
    <div className=" bg-gray-100 h-screen w-full flex flex-col justify-center items-center">
      <div className="w-36 h-36">
        <RivePlayer src={biscuit} stateMachineName="biscuit" />
      </div>
      <ChatBotForm />
    </div>
  );
}

export default App;
