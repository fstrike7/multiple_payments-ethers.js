import { useState, useEffect } from 'react'
import './App.css'
import CustomInput from "./CustomInput"
import ErrorMessage from './ErrorMessage'
import TxList from './TxList'
import { ethers } from 'ethers'
import { Button } from '@chakra-ui/button'
import { Stack } from '@chakra-ui/layout'
import { FormControl, FormLabel, Heading } from '@chakra-ui/react'

function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);

  const [loged, setLoged] = useState(false);
  const [inputList, setInputList] = useState([]);

  const startPayment = async ({ setError, setTxs, ether, addr }) => {
    try {
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");

      await checkIfLoged()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      ethers.utils.getAddress(addr);
      const tx = await signer.sendTransaction({
        to: addr,
        value: ethers.utils.parseEther(ether)
      });
      console.log({ ether, addr });
      console.log("tx", tx);
      setTxs(txs.concat(tx));

    } catch (err) {
      setError(err.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    setTxs([]);
    var regex=/^\d*\.?\d*$/;
    if (data.get("ether") && !data.get("ether").match(regex))
    {
      setError("Cantidad debe ser de tipo decimal");
      return;
    }
    if (inputList && inputList.length!=0) {
      inputList.forEach(async (item, index) => {
        await startPayment({
          setError,
          setTxs,
          ether: data.get("ether"),
          addr: data.get("addr"+index)
        })
      })
    } else {
      setError("Enter at least one address");
    }
  }

  const checkIfLoged = async () => {
    let response = await window.ethereum.send("eth_requestAccounts")
    response.result[0] ? setLoged(true) : setLoged(false)
  }

  useEffect(() => {
    checkIfLoged()
  }, [])

  const removeLast = () => {
    if (inputList.length>1) {
      setInputList(inputList.slice(0,-1) )
    } else {
      setInputList([])
    }
  } 

  const onAddBtnClick = (event) => {
    setInputList(inputList.concat(<CustomInput key={"addr"+inputList.length} name={"addr"+inputList.length} placeholder="Dirección"/>))
  }

  return (
    <div className="App">
      <Heading mb={5}>Automatized multiple payment using Ethers.js</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <Stack margin="auto" w="500px">
            <FormLabel>Direcciones</FormLabel>
            <Button onClick={onAddBtnClick}>Add address</Button>
            {inputList}
            {inputList.length>0 ? <Button onClick={removeLast}>🗑️</Button> : " "}
            <FormLabel>Amount in ETH</FormLabel>
            <CustomInput name="ether" placeholder="Amount in ETH"/>
          </Stack>
          <Stack margin="auto" w="500px">
            {loged ? 
            <Button type="submit">Send payment</Button>
            : <Button onClick={checkIfLoged}>Login</Button>
            }
          </Stack>
          <ErrorMessage message={error} />
          <TxList txs={txs} />
        </FormControl>
      </form>
    </div>
  )
}

export default App