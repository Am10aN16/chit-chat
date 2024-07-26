import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, Box, Flex } from '@chakra-ui/react';
import React from 'react';

const ProfileModal = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <>
            {
                children ? (<span onClick={onOpen}>{children}</span>) :
                    (
                        <IconButton onClick={onOpen}
                            display={{ base: 'flex' }}
                            icon={<ViewIcon />} />
                    )
            }
            <Modal size="lg" isCentered blockScrollOnMount={false} isOpen={isOpen} onClose={onClose} 
                sx={{ backgroundColor: "#0B0C10" }}
            >
                <ModalOverlay />
                <ModalContent h="410px">
                    <ModalHeader
                        fontSize={{base:"25px", sm: '40px'}}
                        fontFamily="Raleway"
                        display="flex"
                        justifyContent="center"
                    >Profile Details</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Flex
                            width="100%"
                            alignItems="center"
                            justifyContent="space-between"
                            flexDir={{ base: 'column', sm: 'row' }}
                        >
                            <Box mb={{ base: 4, sm: 0 }}>
                                <Image
                                    borderRadius="full"
                                    boxSize="150px"
                                    src={user.pic}
                                    alt={user.name}
                                />
                            </Box>
                            <Box textAlign={{ base: 'center', sm: 'left' }} ml={{ sm: 4 }}>
                                <Text
                                    fontSize={{ base: '22px', md: '30px' }}
                                    fontFamily="Raleway"
                                >
                                   Name: {user.name}
                                </Text>
                                <Text
                                    fontSize={{ base: '22px', md: '24px' }}
                                    fontFamily="Raleway"
                                >
                                    Email: {user.email}
                                </Text>
                            </Box>
                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal;
