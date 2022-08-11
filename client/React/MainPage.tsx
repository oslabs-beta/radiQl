import * as React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {FaClipboardList, FaArrowRight, FaCheck} from 'react-icons/fa';
import SavedDatabases from './SavedDatabases';
import dummydata from '../dummyCode';
// Components: 
import CodeBlock from './codeBlock';
import MountainLogo from './MountainLogo'
import SaveDatabaseModal from './SaveDatabaseModal';

import {usersUris} from './types'

const MainPage = ({username}) => {

  const [currentTab, changeTab] = useState<number>(1);
  const [schemaBody, setschemaBody] = useState(dummydata.dummySchema);
  const [resolverBody, setresolverBody] = useState(dummydata.dummyResolver);
  const [instruction, setInstruction] = useState<number>(1);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('');
  //state that shows or hides the save new database name modal
  const [showSaveModal, setShowSaveModal] =  React.useState<boolean>(false);
  const [savedUris , setSavedUris] = React.useState<usersUris | null>(null);


  //send uri request
  const handleConvertURI = async() => {
    const blurBox = (document.getElementById('blur-container'));
    const dbURI = (document.getElementById('userURI') as HTMLInputElement).value;
    try{
      blurBox?.classList.remove('hidden');
      const response = await axios.post('/submitURI', {dbURI: dbURI});

      if (response.data.schema) {
        const stepOne = (document.getElementById('1') as HTMLInputElement);
        const stepTwo = (document.getElementById('2') as HTMLInputElement);
        stepOne.classList.remove('current-step');
        stepTwo.classList.add('current-step');
        setInstruction(2);

        setschemaBody(response.data.schema);
        setresolverBody(response.data.resolver);
      }
    } catch(err){
      console.log('dbURI', err);
    }
    // Unblur
    setTimeout(() => {blurBox?.classList.add('hidden')}, 500);
    // blurBox?.classList.add('hidden');
  }

  // Get URIS Function: Axios request to server  route '/uris' 
  const GetUsersUris = async (): Promise<void | string>  => {
    try {
      // Post body includes current users ID from cookie.SSID
      const { data, status } = await axios.get<usersUris>(
        '/uris', {withCredentials: true},
      );
      console.log(JSON.stringify(data));
      console.log('response status is: ', status);
      // Set saved uris state to the response of the axios request
      setSavedUris(data);
    }  catch (error) {
        console.log('unexpected error: ', error);
        return 'An unexpected error occurred';
    }
  }

  return (
    <div id='main-content' className='mainContent'>
      <div id='dynamic-about' className='dynamicAbout left-1' >
        {showSaveModal && <SaveDatabaseModal GetUsersUris={GetUsersUris} setShowSaveModal={setShowSaveModal} />}
        <h1>How to use radiQL:</h1>
        <div id="circles-container">
          <span 
            id='1' 
            className='circle current-step'>
            { instruction > 1 ? <FaCheck style={{'color': 'lime'}} /> : 1 }
          </span>
          <FaArrowRight />
          <span 
            id='2' 
            className='circle'>
            { instruction > 2 ? <FaCheck style={{'color': 'lime'}} /> : '2' }
          </span>
          <FaArrowRight />
          <span id='3' className='circle'>3</span>
        </div>
        <section id="instructions">
          <h2 className={ instruction === 1 ? '' : 'gray' } >1. Paste your URI below and click "Convert!"</h2> 
          <h2 className={ instruction === 2 ? '' : 'gray' } >2. Click "<FaClipboardList style={{'display': 'inline-block'}}/>" in the output code block to copy the current page</h2>
          <h2 className={ instruction === 3 ? '' : 'gray' } >3. Paste code into your server to begin using GraphQL</h2>
        </section>
        <div id="uri-input-container" className='p-2'>
          <input 
            id='userURI' 
            type="text" 
            placeholder=' Your Database URI' 
            value={selectedDatabase} 
            onChange={(e) => setSelectedDatabase(e.target.value)}
          />
          <motion.button 
            whileHover={{scale: 1.1}} 
            whileTap={{scale: 0.9}} 
            id='convert-btn' 
            onClick={() => handleConvertURI()}>
            Convert!
          </motion.button>
          {username ? 
            <motion.button 
              whileHover={{scale: 1.1}} 
              whileTap={{scale: 0.9}} 
              id='save-database-btn' 
              onClick={() => setShowSaveModal(true)}>
              Save Database
            </motion.button> 
            : <button id='disabled-save' disabled >Log In To Save Database</button> 
          }
          {username && <SavedDatabases savedUris={savedUris} GetUsersUris={GetUsersUris} username={username} setSelectedDatabase={setSelectedDatabase}/>}
        </div>
        <div className='stats left-2'>Stats here?</div>
      </div> 
      <CodeBlock 
        schemaBody={schemaBody} 
        resolverBody={resolverBody} 
        setInstruction={setInstruction} 
        currentTab={currentTab} 
        changeTab={changeTab} 
      />
      <div id='blur-container' className='hidden'>
          < MountainLogo />
        </div>
    </div>
  )
}

export default MainPage;