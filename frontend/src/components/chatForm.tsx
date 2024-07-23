import React, { useState, useEffect, useRef } from "react";

const ChatbotForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([
    {
      text: "Hello. My name is Crackers. I will crack your problems.",
      isBot: true,
    },
  ]);

  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [conversation]);

  const handleEmailChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmail(e.target.value);
  };

  const handleMessageChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (message.trim() !== "") {
      setConversation([...conversation, { text: message, isBot: false }]);
      setMessage("");

      setTimeout(() => {
        const answer = getAnswer(message);
        if (answer) {
          setConversation([
            ...conversation,
            { text: message, isBot: false },
            { text: answer, isBot: true },
          ]);
        } else {
          const botResponses = [
            "I apologize, but I'm unable to assist with that particular case.",
            "Unfortunately, I don't have enough information to provide a solution for that issue.",
            "I'm sorry, but I'm not equipped to handle that specific situation.",
          ];
          const randomResponse =
            botResponses[Math.floor(Math.random() * botResponses.length)];
          setConversation([
            ...conversation,
            { text: message, isBot: false },
            { text: randomResponse, isBot: true },
          ]);
        }
      }, 1000);
    }
  };

  function getAnswer(question: string) {
    const questionAnswerPairs = [
      {
        keywords: ["microchip"],
        A: "Your dog's microchip number may be recorded on pet-related documents such as a pet passport, breeder contract, veterinary medication label, re-homing contract, or vaccination record. If you don't know the number, a vet, dog warden, or dog rescue center can scan your dog for it.",
      },
      {
        keywords: ["email"],
        A: 'To edit your registered email address in the Biscuit app, visit the Edit profile page. Go to your profile, tap on your name, choose "Edit profile", change your details, and press save to update your email address.',
      },
      {
        keywords: ["walk", "activity"],
        A: 'To record a walk or activity with your dog using the Biscuit app, click on "Record activity" on your dashboard or the large plus sign (+) in the navigation pane. This will take you to the "Record activity" page where you can select your dog and then click "Start" to begin recording the walk or activity.',
      },
      {
        keywords: ["hi", "hello"],
        A: "Yo",
      },
      {
        keywords: ["data"],
        A: "We will only be using your Microchip number to check that your dog is registered on a UK microchip database that meets government standards. Please be assured that no one can see your personal address details or make changes to your microchip without your (the registered dog owner's) permission. We will, however, send you annual reminders to ensure you update the database provider if anything's changed. Dogs Trust estimates that 2 out of 3 microchip data are out of date. If you move house or change your phone number, you must contact your microchip database provider to let them know. By completing the Microchip Badge, you'll always have your dog's microchip details to hand. ",
      },
    ];

    const lowercaseQuestion = question.toLowerCase();
    const matchedPair = questionAnswerPairs.find((pair) =>
      pair.keywords.some((keyword) => lowercaseQuestion.includes(keyword))
    );

    if (matchedPair) {
      return matchedPair.A;
    } else {
      return null;
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div
          ref={chatWindowRef}
          className="h-72 overflow-y-auto border border-gray-300 rounded-md p-4 mb-4"
        >
          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${msg.isBot ? "text-left" : "text-right"}`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.isBot
                    ? "bg-gray-200 text-gray-800"
                    : "bg-blue-500 text-white"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={handleMessageChange}
            className="flex-grow px-4 py-2 mr-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatbotForm;
