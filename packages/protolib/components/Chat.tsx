type ChatProps = {
    apiUrl: string;
  };
  
  export const Chat = ({ apiUrl }: ChatProps) => {
    return (
      <iframe
        src={"/workspace/chatbot?apiUrl=" + encodeURIComponent(apiUrl)}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="Chat Widget"
      />
    );
  };