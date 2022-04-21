import Head from "next/head";
import styles from "../styles/Home.module.css";
import { ELECTION_ABI, ELECTION_ADDRESS } from "../contract/index";
import Web3 from "web3";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Home() {
  const [account, setCurrentAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState("");
  const [isHolder, setisHolder] = useState(true);
  const [stakeHolder, setStakeHolder] = useState("");
  const [chairPerson, setChairPerson] = useState('');
  // const [winner, setWinner] = useState('');

  // add Roles
  const addRole = () => {
    if (!stakeHolder) return toast.warn("Select a candidate");
    localStorage.setItem('holder', stakeHolder);
    console.log(stakeHolder);
    const contract = getEthereumContract();
    console.log(contract);
    contract.methods
      .addStakeHolder(selected)
      .call({ from: account })
      .then(() => {
        contract.methods
          .addStakeHolder(selected)
          .send({ from: account })
          .on("confirmation", (confirmationNumber, reciept) => {
            setLoading(false);
          })
          .then((correct) => {
            console.log(correct);
            toast.success("Added Successfully");
            console.log("resolved.......");
            setisHolder(true);
          })
          .catch((e) => {
            setLoading(false);
            console.log(e.message.split(",")[2]);
            toast.error(e.message.split(",")[2]);
          })
          .on(error, (error, reciept) => {
            console.log(error, reciept);
          });
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.message.split(",")[2]);
        console.log(e.message.split(",")[2]);
      });
  };

  // Retrieve votes
  const retrieveVotes = () => {
    const contract = getEthereumContract();
    console.log(contract);
    contract.methods
      .retrieveVotes()
      .call()
      .then((votes) => {
        // console.log(votes);
        setCandidates(votes);
        console.log(candidates);
      })
      .catch((err) => {
        console.log(err);
      });
  };

// Add Chair Person
const AddChairPerson =  (e) => {
  e.preventDefault();
  const rejex = /^0x[a-fA-F0-9]{40}$/;
  if(!rejex.test(chairPerson)) return toast.warn('Chair Person Address is required');
  const contract = getEthereumContract();
  console.log(contract);
  console.log(chairPerson);
  contract.methods
    .addChairPerson(chairPerson)
    .call({ from: account })
    .then(() => {
      contract.methods
        .addChairPerson(chairPerson)
        .send({ from: account })
        .on("confirmation", (confirmationNumber, reciept) => {
          setLoading(false);
        })
        .then((correct) => {
          console.log(correct);
          toast.success("Chairperson Added Successfully");
          console.log("resolved.......");
          setChairPerson("");
        })
        .catch((e) => {
          setLoading(false);
          console.log(e.message.split(",")[2]);
          toast.error(e.message.split(",")[2]);
        })
        .on(error, (error, reciept) => {
          console.log(error, reciept);
        });
    })
    .catch((e) => {
      setLoading(false);
      toast.error(e.message.split(",")[2]);
      console.log(e.message.split(",")[2]);
    });
} 

  useEffect(() => {
    retrieveVotes();
  }, [account]);

  useEffect(() => {
    async function checkConnectedWallet() {
      let eth;
      if (window !== "undefined") {
        eth = window.ethereum;
      }
      try {
        if (!eth) return alert("please install metamask");
        let accounts = await eth.request({ method: "eth_accounts" });
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          console.log("connected");
        }
      } catch (error) {
        console.error(error);
        throw new Error("No ethereum object");
      }
    }
    checkConnectedWallet();
  }, []);
  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      window.ethereum.enable();
      provider = window.ethereum;
    } else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
    console.log(provider);
    return provider;
  };
  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
        const acc = await currentProvider.request({
          method: "eth_requestAccounts",
        });
        console.log(acc);
        const web3 = new Web3(currentProvider);
        console.log(web3);
        const userAccount = await web3.eth.getAccounts();
        console.log(userAccount, "user");
        const chainId = await web3.eth.getChainId();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, "ether"); //Convert balance to wei
        //
        setCurrentAccount(account);
        if (userAccount.length === 0) {
          console.log("Please connect to meta mask");
        }
      }
    } catch (err) {
      console.log(err);
      console.log(
        "There was an error fetching your accounts. Make sure your Ethereum client is configured correctly."
      );
    }
  };
  // Add Cnadidate
  const AddCandidate = (e) => {
    e.preventDefault();
    const candidates = candidate.split(",");
    const contract = getEthereumContract();
    console.log(contract);
    console.log(candidates);
    contract.methods
      ._setUpElection(candidates)
      .call({ from: account })
      .then(() => {
        contract.methods
          ._setUpElection(candidates)
          .send({ from: account })
          .on("confirmation", (confirmationNumber, reciept) => {
            setLoading(false);
          })
          .then((correct) => {
            console.log(correct);
            toast.success("Candidate Added Successfully");
            console.log("resolved.......");
            setCandidate("");
            retrieveVotes();
          })
          .catch((e) => {
            setLoading(false);
            console.log(e.message.split(",")[2]);
            toast.error(e.message.split(",")[2]);
          })
          .on(error, (error, reciept) => {
            console.log(error, reciept);
          });
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.message.split(",")[2]);
        console.log(e.message.split(",")[2]);
      });
  };
  // Start Election
  const startElection = () => {
    const contract = getEthereumContract();
    console.log(contract);
    contract.methods
      .startElection()
      .call({ from: account })
      .then(() => {
        contract.methods
          .startElection()
          .send({ from: account })
          .on("confirmation", (confirmationNumber, reciept) => {
            setLoading(false);
          })
          .then((correct) => {
            console.log(correct);
            toast.success("Election Started By ChairPerson");
            console.log("resolved.......");
          })
          .catch((e) => {
            setLoading(false);
            console.log(e.message.split(",")[2]);
            toast.error(e.message.split(",")[2]);
          })
          .on(error, (error, reciept) => {
            console.log(error, reciept);
          });
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.message.split(",")[2]);
        console.log(e.message.split(",")[2]);
      });
  };

  // Start Election
  const endElection = () => {
    const contract = getEthereumContract();
    console.log(contract);
    contract.methods
      .endElection()
      .call({ from: account })
      .then(() => {
        contract.methods
          .endElection()
          .send({ from: account })
          .on("confirmation", (confirmationNumber, reciept) => {
            setLoading(false);
          })
          .then((correct) => {
            console.log(correct);
            toast.success("Election Ended By ChairPerson");
            console.log("resolved.......");
          })
          .catch((e) => {
            setLoading(false);
            console.log(e.message.split(",")[2]);
            toast.error(e.message.split(",")[2]);
          })
          .on(error, (error, reciept) => {
            console.log(error, reciept);
          });
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.message.split(",")[2]);
        console.log(e.message.split(",")[2]);
      });
  };

  // Get Contract
  const getEthereumContract = () => {
    let eth;
    if (window !== "undefined") {
      eth = window.ethereum;
    }
    const web3 = new Web3(eth);
    const contactList = new web3.eth.Contract(
      ELECTION_ABI.abi,
      ELECTION_ADDRESS
    );
    // set contact list to state variable.
    return contactList;
  };

  // Voting
  const Vote = () => {
    if (!selected) return toast.warn("Select a candidate");
    console.log(selected);
    const contract = getEthereumContract();
    console.log(contract);
    console.log(candidates);
    contract.methods
      .vote(selected)
      .call({ from: account })
      .then(() => {
        contract.methods
          .vote(selected)
          .send({ from: account })
          .on("confirmation", (confirmationNumber, reciept) => {
            setLoading(false);
          })
          .then((correct) => {
            console.log(correct);
            toast.success("Voted Successfully");
            console.log("resolved.......");
            retrieveVotes();
          })
          .catch((e) => {
            setLoading(false);
            console.log(e.message.split(",")[2]);
            toast.error(e.message.split(",")[2]);
          })
          .on(error, (error, reciept) => {
            console.log(error, reciept);
          });
      })
      .catch((e) => {
        setLoading(false);
        toast.error(e.message.split(",")[2]);
        console.log(e.message.split(",")[2]);
      });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Voting Dapp</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-[70%] mx-auto">
        <nav className="py-4 mb-8 flex justify-between items-center">
          <div className="text-gray-900 font-semibold text-2xl">
            Zuri_Election
          </div>
          <button
            onClick={onConnect}
            className="py-2 px-4 border-none bg-green-600 rounded-md text-white text-lg font-semibold"
          >
            {account ? account : "Connect Wallet"}
          </button>
        </nav>
        <div>
            <div className="w-full flex flex-col justify-center items-center max-w-[80%] mx-auto border-gray">
              <select
                className="w-full mb-16 block"
                onChange={(e) => setStakeHolder(e.target.value)}
              >
                <option value="none" selected disabled hidden>
                  Select Your Role
                </option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
                <option value="Director">Director</option>
              </select>
              <button
                onClick={addRole}
                className="py-1  px-8 border-none bg-green-500 rounded-md text-white text-lg font-semibold"
              >
                Set Stakeholder Role
              </button>
            </div>
          </div>
          <>
            <div className="relative max-w-[80%] my-8 mx-auto overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      S/N
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Candidate
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Vote Count
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((x, i) => (
                    <tr
                      key={i}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                      >
                        {x.id}
                      </th>
                      <td className="px-6 py-4">{x.name}</td>
                      <td className="px-6 py-4">{x.voteCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full  max-w-[80%] mx-auto border-gray my-12">
              <select
                className="w-full block"
                onChange={(e) => setSelected(e.target.value)}
              >
                <option value="none" selected disabled hidden>
                  Select a Candidate
                </option>
                {candidates.map((x, i) => (
                  <option value={x.id} className="py-1" key={i}>
                    {x.name}
                  </option>
                ))}
              </select>
              <button
                onClick={Vote}
                className="py-1 my-4 w-[18%]  px-8 border-none bg-green-500 rounded-md text-white text-lg font-semibold"
              >
                Vote
              </button>
            </div>
            <div className="flex max-w-[80%] mx-auto space-y-4 items-start flex-col justify-start">
              <div className="flex flex-col items-center">
                <button
                  onClick={startElection}
                  className="py-1 px-8 border-none bg-green-500 rounded-md text-white text-lg font-semibold"
                >
                  Start Election
                </button>
              </div>
              <div className="flex flex-col items-center">
                <button
                  onClick={endElection}
                  className="py-1 px-8 border-none bg-green-500 rounded-md text-white text-lg font-semibold"
                >
                  End Election
                </button>
              </div>
              <div className="flex flex-col items-center">
                <form onSubmit={AddCandidate}>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Enter Candidate
                    </label>
                    <input
                      type="text"
                      value={candidate}
                      onChange={(e) => setCandidate(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@flowbite.com"
                      required
                    />
                  </div>
                  <button className="py-1 px-8 border-none bg-green-500 rounded-md text-white text-lg font-semibold">
                    {loading ? "Adding" : "Add Candidates"}
                  </button>
                </form>
                <form className="my-8" onSubmit={AddChairPerson}>
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Grant ChairPerson Role
                    </label>
                    <input
                      type="text"
                      value={chairPerson}
                      onChange={(e) => setChairPerson(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@flowbite.com"
                      required
                    />
                  </div>
                  <button className="py-1 px-8 border-none bg-green-500 rounded-md text-white text-lg font-semibold">
                    {loading ? "Adding" : "Add Candidates"}
                  </button>
                </form>
              </div>
            </div>
          </>
        
      </div>
    </div>
  );
}
