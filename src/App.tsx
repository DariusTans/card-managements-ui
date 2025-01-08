import React, { ReactElement, useState, useEffect } from 'react';
import KnowledgeCard, { Knowledge } from './components/knowledgecard';


interface FormData {
  name: string;
  description: string;
  files: File[];
}

function App(): ReactElement {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({ name: '', description: '', files: [] });
  const [knowledgeData, setKnowledgeData] = useState<Knowledge[]>([]);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001';
  console.log("process.env", process.env.REACT_APP_API_BASE_URL);
  console.log("API_BASE_URL", API_BASE_URL);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/get_data`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setKnowledgeData(data);
      } catch (error) {
        console.error('Error fetching knowledge data:', error);
      }
    };

    fetchData();
  }, []);

  console.log("knowledgeData", knowledgeData);
  console.log("knowledgeData length", knowledgeData.length);

  const openUploadDialog = () => setDialogOpen(true);
  const closeUploadDialog = () => setDialogOpen(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setFormData((prev) => ({ ...prev, files }));
  };

  const handleSubmit = async () => {
    const form = new FormData();
    form.append('namedoc', formData.name);
    form.append('description_doc', formData.description);
    formData.files.forEach((file) => {
      form.append('files', file);
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/upload?namedoc=${formData.name}&description_doc=${formData.description}`,
        {
          method: 'POST',
          body: form,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      alert('Files uploaded successfully!');
      closeUploadDialog();
    } catch (error) {
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  const handleRemove = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this knowledge card?');
    if(!confirmDelete) {
      return 
    }

    try {
      const response = await fetch(`${API_BASE_URL}/remove_data?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove data');
      }

      setKnowledgeData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error removing knowledge data:', error);
    }
  };


  return (
    <div className='w-full p-[32px]'>
      <p className='text-xl text-white'>AlFred Knowledge Management</p>
      <div className='flex justify-end mt-4'>
        <button
          className="select-none rounded-lg bg-pink-500 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          type="button"
          onClick={openUploadDialog}
          data-ripple-light="true"
        >
          + Add
        </button>
      </div>
      <div className='flex flex-row gap-10 justify-start mt-[48px]'>
       {knowledgeData.length > 0 ? (
          knowledgeData.map((item) => (
          <KnowledgeCard 
            key={item._id} 
            namedoc={item.namedoc} 
            description_doc={item.description_doc} 
            _id={item._id} 
            onRemove={handleRemove}
            />
          ))
        ) : (
          <p className='text-gray-400'>No knowledge cards available</p>
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" onClick={closeUploadDialog}></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full sm:mt-0">
                      <h3 className="text-lg font-semibold text-gray-900" id="modal-title">Upload Files</h3>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-sm"
                        ></textarea>
                      </div>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="file">Upload Files</label>
                        <input
                          type="file"
                          id="file"
                          multiple
                          onChange={handleFileChange}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-pink-500 file:px-3 file:py-2 file:text-white hover:file:bg-pink-600"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex w-full justify-center rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-400 sm:ml-3 sm:w-auto"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={closeUploadDialog}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
