import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className='page_404 flex items-center flex-column justify-center'>
      <div className='container flex items-center flex-column gap'>
        <div className='four_zero_four_bg'>
          <h1 className='text-center'>404</h1>
        </div>

        <div className='content_box_404 flex items-center flex-column gap-2'>
          <h3>Look like you're lost</h3>
          <p>the page you are looking for not avaible!</p>
          <Link
            to='/'
            className='link_404'
          >
            Go to Home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
