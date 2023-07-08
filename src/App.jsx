import { useState } from 'react'
import Navbar from './navbar';
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {MainContainer, Message, ChatContainer, MessageInput, MessageList, TypingIndicator} from '@chatscope/chat-ui-kit-react';

const API_KEY="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";

function App() {
  const[typing,setTyping]=useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hello! I am your Chat Bot",
      sender: "Bot"
    }
  ])

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "You",
      direction: "outgoing"
    }

  const newMessages = [...messages , newMessage];
  setMessages(newMessages);

    setTyping(true);
    await processToGPT(newMessages);
  }

  async function processToGPT(chatMessages){
    let apiMessages = chatMessages.map((messageObject) => {
      let role="";
      if(messageObject.sender== "Bot"){
        role="assistant"
      }
      else{
        role= "user";
      }
      return{ role : role, content: messageObject.message }
    });

    const systemMessage= {
      role: "system",
      content: "talk like a professor"
    }

    const apiReqBody={
      "model": "gpt-3.5-turbo",
      "messages": [systemMessage, ...apiMessages]
    }

    await fetch("https://api.openai.com/v1/chat/completions",{
      method:"POST",
      headers:{
        "Authorization" : "Bearer "+ API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiReqBody)
    }).then((data) => {
      return data.json();
    }).then((data)=>{
      console.log(data);
      console.log(data.choices[0].message.content);
      setMessages(
        [ ...chatMessages, {
          message: data.choices[0].message.content,
          sender: "Bot"
        }]
      )
      setTyping(false);
    });
  }

  return (
      <div className="App">
        {/* <div className="nav">
        <ul>
          <li><a href="#forecat" class="active">ChatBot</a></li>
          <li><a href="https://www.linkedin.com/in/sudhanshu-singh-540133229/">MyLinkedIn</a></li>
          
          <li class="right"><a href="#about">Contact Me</a></li>
        </ul>
      </div> */}
      <Navbar />
        <div className='ChatS'>
        <MainContainer>
          <ChatContainer>
            <MessageList
            scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="Bot is typing.." /> : null}
              >
            {messages.map((message,i)=> {
              return <Message key={i} model={message} />
            })}
            </MessageList>
            <MessageInput placeholder='Write your message here!! ' onSend={handleSend}/>
          </ChatContainer>
        </MainContainer>
        </div>
      </div>
  )
}

export default App
