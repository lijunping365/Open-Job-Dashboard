import { Input } from 'antd';
import { useRef, useState } from 'react';

const { TextArea } = Input;

const AIChat = () => {
  const [inputText, setInputText] = useState('');
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const textareaRef = useRef<any>(null);
  const messageRef = useRef<any>(null);

  const msgToBottom = () => {
    setTimeout(() => {
      messageRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 0);
  };

  const onSubmit = async (inputTextValue: string) => {};

  const handleKeyUp = async (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      await submit();
    }
  };
};
