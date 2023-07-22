
'use client'
import axios from 'axios'
import { useState } from 'react';
import { saveAs } from 'file-saver';
import dotenv from 'dotenv';
dotenv.config();
const BASEURL = process.env.BASEURL;

function File({renderState, NameGift, fileName, fileURL, handleDownload, handleDelete}){

  return(
  <div>
    <p>{fileName}</p>
    {renderState==1 && <button onClick={() => handleDelete(NameGift)}>delete</button>}
    {renderState==2 &&<button onClick={() => handleDownload(fileURL, fileName)}>download</button>}
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
        return
      }
    }

    
  }



  const handleFileDrop = (e) => {

 
    
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;

    if (files.length > 5) {
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
      
      
      const response = await axios.post('http://localhost:3000/upload', formData, {
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
   axios.get('http://localhost:3000/download/'+fileURL, { responseType: 'blob' })
   .then((response)=>{
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      saveAs(blob, fileName);
      
   }).catch(()=>{
    console.error("Error downloading file:", error);
   })
  };





  return (
    <div>
      <div className='leftDiv'>
        <h1>Конвертируйте GIFT в Word за пару кликов</h1>
        <p>Взникли проблемы?</p>
        <p>Напишите на shirokova@gmail.com</p>
      </div>
      
      <div className='rightDiv'>
    
    { renderState==0 &&
      <div>
         <div className='dropArea' onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()} onDragEnter={(e) => e.preventDefault()}>
          <p>Перетащите файлы сюда</p>
        </div>
        <input type="file" onChange={handleFileChange} multiple accept=".gift" 
        style={{
          color: 'transparent'}}/>
      </div>

    }
       

       

        {
          renderState!==0 &&
          <div>
            <p>Selected Files:</p>
              {selectedFiles.map((file, index) => (
                <div>
                  <ul>
                  <li key={index}><File renderState={renderState} NameGift={file.name} fileURL={downloadLinks[index]} fileName={file.name.substring(0,file.name.indexOf("."))} handleDownload={handleDownload} handleDelete={handleDelete}/></li>
                  </ul>
                </div>
              ))}

          </div>
        }


          {renderState==1 &&
              <button onClick={handleUpload}>Конвертировать</button>
          }
          {renderState==2 &&
              <button onClick={()=>setRenderState(0)}>Конвертировать еще</button>
          }
      </div>
     
    </div>
  );
}



/*
return (
    <div>
      <div className='leftDiv'>
        <h1>Конвертируйте GIFT в Word за пару кликов</h1>
        <p>Взникли проблемы?</p>
        <p>Напишите на shirokova@gmail.com</p>
      </div>
      
      <div className='rightDiv'>
    
    { renderState==0 &&
      <div>
         <div className='dropArea' onDrop={handleFileDrop} onDragOver={(e) => e.preventDefault()} onDragEnter={(e) => e.preventDefault()}>
          <p>Перетащите файлы сюда</p>
        </div>
        <input type="file" onChange={handleFileChange} multiple accept=".gift" 
        style={{
          color: 'transparent'}}/>
      </div>

    }
       

        {
          renderState==1 &&
          <div>
            <p>Selected Files:</p>
              {Array.from(selectedFiles).map((file, index) => (
                <div>
                  <li key={index}>{file.name}</li>
                </div>
              ))}
            <button onClick={handleUpload}>Конвертировать</button>
          </div>
        }
        


        { renderState==2  &&
          <div>
          {Array.from(downloadLinks).map((file, index) => (
                <div>
                  <li key={index}>{file}</li>
                  <button onClick={()=>handleDownload(file)}>download</button>
                </div>
              ))}
              <button onClick={()=>setRenderState(0)}>Конвертировать еще</button>
          
          </div>
        }
          
      </div>
     
    </div>
  );
}

*/