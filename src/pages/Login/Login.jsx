import { Form } from 'antd';
import { Link } from 'react-router-dom';

function Login() {
  const onSubmit = (values) => {};

  return (
    <div className='flex justify-center items-center h-screen'>
      <Form
        layout='vertical'
        className='w-400 bg-white p-2'
        onSubmit={onSubmit}
      >
        <h2 className='uppercase my-1 text-center'>
          <strong>MedConnect Login</strong>
        </h2>
        <hr />
        <Form.Item
          label='Email'
          name='email'
          className='my-1'
        >
          <input type='email' />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          className='my-1'
        >
          <input type='password' />
        </Form.Item>
        <button
          className='contained-btn my-1'
          type='submit'
        >
          Login
        </button>
        <Link
          className='underline'
          to='/register'
        >
          Don't have an account? <strong>Sign Up</strong>
        </Link>
      </Form>
    </div>
  );
}

export default Login;
