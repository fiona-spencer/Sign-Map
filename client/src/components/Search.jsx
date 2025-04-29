import { AiOutlineSearch } from "react-icons/ai";
import { TextInput, Button } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
  };

  return (
    <div className="py-2 flex justify-center items-center gap-4
      bg-[#173e28] text-black dark:bg-green-600 dark:text-white
      transition-colors duration-300">
      <div className="text-white dark:text-white"></div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          color="green" // Ensure consistent input field styling
          className='inline sm:w-[500px] w-full pr-'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
}
