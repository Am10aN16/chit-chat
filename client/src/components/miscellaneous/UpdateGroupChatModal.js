import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Stack, useDisclosure, useToast } from '@chakra-ui/react';
import React from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem'; 
import UserListItem from '../UserAvatar/UserListItem';
import axios from 'axios'

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, FetchMessages}) => {
    const [groupChatName, setGroupChatName] = React.useState();
    const [search, setSearch] = React.useState();
    const [searchResult, setSearchResult] = React.useState();
    const [loading, setLoading] = React.useState(false);
    const [renameLoading, setRenameLoading] = React.useState(false);
    
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {selectedChat , setSelectedChat, user } = ChatState();

    const handleRemove = async(user1)=>{
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
            toast({
                title: "Only Admins can remove users.",
                description: `${user.name} is not an admin.`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            FetchMessages();
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    };

    const handleAddUser = async(user1)=>{
        if(selectedChat.users.find((u)=> u._id === user1._id)){
            toast({
                title: "User already in group.",
                description: `${user1.name} is already in the group.`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        if(selectedChat.groupAdmin._id !== user._id){
            toast({
                title: "Only Admins can add users.",
                description: `${user.name} is not an admin.`,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };
            const {data} = await axios.put("/api/chat/groupadd", {
                chatId: selectedChat._id,
                userId: user1._id
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            })
        }
    };

    const handleRename = async()=>{
        if(!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
            const {data} = await axios.put("/api/chat/rename", {
                chatId : selectedChat._id,
                chatName: groupChatName
            }, config);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            toast({
                title: "Updated Successfully.",
                description: 'Group chat name updated successfully.',
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "bottom"
            });
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position:"bottom"
            });
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: 'Error Occured',
                description: error.response.data.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
  return (
    <>
          <IconButton display={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

          <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader
                  fontSize="35px"
                  fontFamily="Raleway"
                  display="flex"
                  justifyContent="center"
                  >{selectedChat.chatName}</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                     <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                        {selectedChat.users.map((user)=>(
                            <UserBadgeItem
                            key={user._id}
                            user={user}
                            handleFunction={()=> handleRemove(user)}
                            />
                        ))}
                     </Box>
                     <FormControl display='flex'>
                        <Input
                        placeholder='Chat Name'
                        mb={3}
                        value={groupChatName}
                        onChange={(e)=>setGroupChatName(e.target.value)}
                        />
                        <Button
                        variant='solid'
                        colorScheme='teal'
                        ml={1}
                        isLoading={renameLoading}
                        onClick={handleRename}
                        >Update</Button>
                     </FormControl>
                      <FormControl>
                          <Input
                              placeholder='Add Users to Group'
                              mb={1}    
                              onChange={(e) => handleSearch(e.target.value)}
                          />
                          </FormControl>
                          {loading ? (
                          <Stack>
                              <Skeleton height='45px' />
                              <Skeleton height='45px' />
                              <Skeleton height='45px' />
                          </Stack>
                          ) : (
                            searchResult?.map((user)=> (
                                <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={()=> handleAddUser(user)}
                                />
                            ))
                          )}
                  </ModalBody>

                  <ModalFooter>
                      <Button colorScheme='red'  onClick={() => handleRemove(user)}>
                          Leave Group
                      </Button>                      
                  </ModalFooter>
              </ModalContent>
          </Modal>
    </>
  )
}

export default UpdateGroupChatModal