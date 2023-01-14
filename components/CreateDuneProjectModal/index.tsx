import {
  Button,
  FormControl, FormLabel, HStack, Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text, useDisclosure, useToast
} from "@chakra-ui/react";
import {ChevronRightIcon} from "@chakra-ui/icons";
import {useCallback, useEffect, useState} from "react";
import {isAddress} from "ethers/lib/utils";
import {useNetwork, useSignMessage, useToken} from "wagmi";
import axios from "axios";

const CreateDuneProjectModal = () => {
  const { chain } = useNetwork()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [token, setToken] = useState("")
  const { data: tokenData, status: tokenStatus } = useToken({
    chainId: chain?.id,
    address: isAddress(token) ? token : undefined,
  })
  const toast = useToast()
  const create = useCallback(async () => {
    try {
      const res = await axios({
        method: 'post',
        url: `https://api.wizardingpay.com/game/dune/project`,
        data: {
          token: {
            address: tokenData?.address,
            decimals: tokenData?.decimals,
            name: tokenData?.name,
            symbol: tokenData?.symbol,
            totalSupply: tokenData?.totalSupply.value.toString(),
          }
        }
      })
      if (res.data.address === tokenData?.address) {
        onClose()
        toast({
          title: "Success",
          status: "success",
          variant: "subtle",
          description: "Your dune project is created success!",
        })
      } else {
        toast({
          title: "Error",
          status: "error",
          variant: "subtle",
          description: "Your dune project is created failed!",
        })
      }
    } catch (e) {
      toast({
        title: "Error",
        status: "error",
        variant: "subtle",
        description: "Your dune project is created failed!",
      })
    }
  }, [tokenData?.address, tokenData?.decimals, tokenData?.name, tokenData?.symbol, tokenData?.totalSupply.value, onClose, toast])

  return (
    <>
      <Text cursor={"pointer"} _hover={{textDecoration: 'underline'}} onClick={() => {
        onOpen()
      }} fontSize={'sm'} fontWeight={'semibold'} color={'blue.500'}>Setup wizard <ChevronRightIcon/></Text>
      <Modal isCentered isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay/>
        <ModalContent borderRadius={12}>
          <ModalHeader fontSize={'md'} fontWeight={'bold'} fontFamily={'Montserrat'}>Create a dune project</ModalHeader>
          <ModalCloseButton borderRadius={'full'}/>
          <ModalBody>
            <Stack>
              <FormControl isInvalid={(!!token && !isAddress(token) || tokenStatus === 'error')}>
                <FormLabel fontSize={'xs'} fontFamily={'Montserrat'}>
                  token: {tokenStatus === 'loading' && '(loading...)'} {tokenStatus === 'success' && `(${tokenData?.name}, ${tokenData?.symbol})`} {tokenStatus === 'error' && '(error token)'}
                </FormLabel>
                <Input
                  value={token}
                  onChange={(e) => setToken(e.target.value)}/>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <HStack>
              <Button variant={'ghost'} onClick={onClose}>Cancel</Button>
              <Button
                onClick={create}
                disabled={!isAddress(token)}>Sign and Create</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateDuneProjectModal