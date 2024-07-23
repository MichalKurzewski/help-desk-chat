import {
    Alignment,
    Fit,
    Layout,
    useRive,
  } from "@rive-app/react-canvas";
  
  
  interface IRiveCanvasProps {
    src: string;
    stateMachineName: string;
    animation?: string;
  }
  
  const RivePlayer: React.FC<IRiveCanvasProps> = ({
    src,
    stateMachineName,
    animation,
  }) => {
    const { RiveComponent } = useRive({
      src: src,
      stateMachines: stateMachineName,
      animations: animation || "",
      autoplay: true,
      layout: new Layout({
        fit: Fit.Contain,
        alignment: Alignment.Center,
      }),
    });
  
    return <RiveComponent />;
  };
  
  export default RivePlayer;