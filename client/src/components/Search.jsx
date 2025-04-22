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
      bg-[#173e28] text-white dark:bg-gray-500 dark:text-white
      transition-colors duration-300">
      <div className="text-white dark:text-white">Search for a Report</div>
      <form onSubmit={handleSubmit} className="flex items-center">
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline w-96'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          color="gray" // Ensure consistent input field styling
        />
        <Button className='w-12 h-10 lg:hidden' color='gray' pill>
          <AiOutlineSearch />
        </Button>
      </form>
    </div>
  );
}
