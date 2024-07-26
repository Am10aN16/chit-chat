import React, { useEffect } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Avatar, AvatarGroup, Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = React.useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      const { data } = await axios.get('/api/chat', config);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Error Occured',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left'
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "24px", md: "26px" }}
        fontFamily="Raleway"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >My Chats
      <GroupChatModal>
        <Button
          display="flex"
          fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          rightIcon={<AddIcon />}
        >
          New Group Chat
        </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY='scroll'>
            {chats.map((chat) => {
              const isSelected = selectedChat && selectedChat._id === chat._id;
              return chat.isGroupChat ? (
                <Box
                onClick={() => setSelectedChat(chat)}
                  w="100%"
                  display="flex"
                  alignItems="center"
                  color="black"
                  px={3}
                  py={2}
                  mb={2}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isSelected ? "#38B2AC" : ""}
                  _hover={{
                    background: "#38B2AC",
                    color: "white",
                  }}
                  sx={
                    {
                      border: "1px solid #38B2AC",
                      color: "#fff",
                    }
                  }
                >
                  <AvatarGroup size='sm' max={2}>
                    {
                      chat.users.map((user) => (
                        <Avatar
                          key={user._id}
                          name={user.name}
                          src={user.pic}
                          size='sm'
                        />
                      ))
                    }
                  </AvatarGroup>
                  <Text key={chat._id}>{chat.chatName}</Text>
                </Box>
              ) : (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  w="100%"
                  display="flex"
                  alignItems="center"
                  color="black"
                  px={3}
                  py={2}
                  mb={2}
                  bg={isSelected ? "#38B2AC" :""}
                  borderRadius="lg"
                  cursor="pointer"
                  _hover={{
                    background: "#38B2AC",
                    color: "white",
                  }}
                    sx={
                      {
                        border: "1px solid #38B2AC",
                        color: "#fff",
                      }
                    }
                >
                  <Avatar
                    key={chat._id}
                    name={chat.users[1].name}
                    src={chat.users[1].pic}
                    size='sm'
                  />
                  <Text key={chat._id} px={2}>{chat.users[1].name}</Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats