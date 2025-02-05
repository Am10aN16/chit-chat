import React, { useEffect } from 'react'
import { Box, Container, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {Login , SignUp} from '../components/authentication'
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (!user) {
      navigate("/chats");
    }

  }, [navigate])

  return (
    <Container maxW='xl' centerContent>
      <Box
      display="flex"
      justifyContent="center"
      p={3}
      bg={"white"}
      w="100%"
      m='40px 0 15px 0'
      borderRadius="lg"
      borderWidth="1px"
      >
        <Text
        fontSize="4xl"
          fontFamily="Rajdhani"
        >Chit - Chat</Text>
      </Box>

      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant='soft-rounded' colorScheme='gray'>
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
             <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage