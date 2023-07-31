
'use client'
import axios from 'axios'
import "../../styles/globals.css";
import { useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import dotenv from 'dotenv';
import Image from 'next/image';
dotenv.config();
const BASEURL = process.env.BASEURL;

function File({renderState, NameGift, fileName, fileURL, handleDownload, handleDelete}){

  return(
  <div className='FileComponent'>
    <div className='fileName'>
    {renderState==1 && 
    <Image src= "/assets/G.svg" width={40} height={40}></Image>
  }
    {renderState==2 && 
    <Image src= "/assets/D.svg" width={40} height={40}></Image>
  }
    <p>{fileName}</p>
    </div>
    {renderState==1 && 
        <button className="delete" onClick={() => handleDelete(NameGift)}><Image src= "/assets/trash.svg" width={20} height={25} alt='trash'></Image></button>
      }
    {renderState==2 &&
    <div>
    <button className="download" onClick={() => handleDownload(fileURL, fileName)}>Скачать</button>
    </div>
    }
  </div>
  )
}

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [renderState, setRenderState] = useState(0);



  const handleDelete = (NameGift) => {
    //const updatedSelectedFiles = selectedFiles.filter((file) => file.name !== NameGift);
    
    const arrayFromSelectedFiles = Array.from(selectedFiles)
    console.log(arrayFromSelectedFiles.length)
    let updatedSelectedFiles = selectedFiles;

    for (let i=0; i<arrayFromSelectedFiles.length; i++){
      //console.log(selectedFiles[i])
      //console.log(selectedFiles[i].name)

        if (selectedFiles[i].name==NameGift){
          console.log("нашел совпадение" + selectedFiles[i].name);
          setSelectedFiles((prevFiles) => prevFiles.filter((file, index) => index !== i));
          console.log(selectedFiles);
        }
        if (selectedFiles.length==1){setRenderState(0)}
      
    }
  }

  const handleClear =() => {
    setSelectedFiles[[]];
    setRenderState(0);
  }



  const handleFileDrop = (e) => {

 
    
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;

    if (droppedFiles.length > 5) {
      // Limit the number of files to 3
      alert('Please select up to 3 files.');
      return;
    }
    console.log("files dropped");
    setSelectedFiles(Array.from(droppedFiles));
    console.log(selectedFiles);
    setRenderState(1);
  };



   const handleFileChange = (e) => {

    const files = e.target.files;
    if (files.length > 5) {
      // Limit the number of files to 3
      alert('Please select up to 3 files.');
      return;
    }
    console.log("files selected")
    setSelectedFiles(Array.from(files))
    setRenderState(1);
  };





  const handleUpload = async () => {
    try {
      const formData = new FormData();

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('giftFiles', selectedFiles[i]);
        console.log(selectedFiles);
        console.log(formData.data);
      }

      
      console.log("uploadInitiated")
      
      
      const response = await axios.post(BASEURL+'/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        //responseType: 'blob' // Request response as a blob
      });
      setDownloadLinks(response.data.convertedFiles);
      setRenderState(2);
      console.log(response.data);
      console.log(downloadLinks);
      //setSelectedFiles[[]];
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

 
  
  const handleDownload = (fileURL, fileName) => {
   axios.get(BASEURL+'/download/'+fileURL, { responseType: 'blob' })
   .then((response)=>{
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, fileName);
      
   }).catch(()=>{
    console.error("Error downloading file:", error);
   })
  };


const fileInputRef = useRef(null);

const handleButtonClick =() => {
  fileInputRef.current.click();
}


  return (
    <div className='main'>
 
      
      <div className='rightDiv'>
        <Image src='/assets/logo_main_sm.svg'
        alt='политех лого'
        width={300} 
        height={55}
        />
    
    { renderState==0 &&
      <div className='renderState'>
        <div className='caption'>
        <h1>Загрузите файлы</h1>
        <p>Файлы должны быть в формате GIFT</p>
        </div>

         <div className='dropArea' onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()} onDragEnter={(e) => e.preventDefault()}>
         <Image src= "/assets/cloud.svg" width={25} height={30} alt='cloud'></Image>
          <p>Перетащите файлы в эту область</p>
        </div>
        <button className='selectFilesButton' onClick={handleButtonClick}>Выбрать файлы на компьютере</button>
        <input type="file" className='chooseFile' onChange={handleFileChange} ref={fileInputRef} multiple accept=".gift" 
        style={{
          display:'none'}}/>
      </div>

    }
       

       

        {
          renderState!==0 &&
          <div className='renderState'>
            <div>
              {renderState == 1 && 
              <div className='caption'>
                <h1>Файлы загружены</h1>
                <p>Можно Конвертировать</p>
              </div>}

              {renderState == 2 && 
              <div className='caption'>
                <h1>Успешно!</h1>
                <p>Можно загрузить файлы</p>
                </div>
              }
            </div>
            <div className='fileList'>
              {selectedFiles.map((file, index) => (
                <div>
                  <ul className='list'>
                  <li key={index}><File renderState={renderState} NameGift={file.name} fileURL={downloadLinks[index]} fileName={file.name.substring(0,file.name.indexOf("."))} handleDownload={handleDownload} handleDelete={handleDelete}/></li>
                  </ul>
                </div>
              ))}
        </div>
          </div>
        }


          {renderState==1 &&
            <div className='clearAndConvert'>
              <button className="convertButton" onClick={handleUpload}>Конвертировать</button>
              <button className="clear" onClick={handleClear}>Очистить</button>
            </div>
          }
          {renderState==2 &&
              <button className="convertAnotherButton" onClick={()=>setRenderState(0)}>Конвертировать еще</button>
          }
      </div>
     
    </div>
  );
}

/*

   
<div className='leftDiv'>
<h1>Конвертируйте GIFT в Word за пару кликов</h1>
<p>Взникли проблемы?</p>
<p>Напишите на shirokova@gmail.com</p>
</div>

*/
