import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';

const Search = Input.Search;

function Home() {
  const navigate = useNavigate();

  return (
    <section className='flex justify-between p-2'>
      <div>
        <Search
          placeholder='Search doctor'
          className='w-300'
        />
      </div>
      <button
        className='contained-btn my-1 p-1'
        onClick={() => navigate('/apply-doctor')}
      >
        Apply Doctor
      </button>
    </section>
  );
}

export default Home;
