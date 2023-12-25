import { Form, Input, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../requests/users';

function Login() {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await loginUser(values);
      if (res.success) {
        message.success(res.message);
        form.resetFields();
        localStorage.setItem(
          'user',
          JSON.stringify({ ...res.data, password: '', confirmPassword: '' })
        );
        navigate('/');
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen'>
      <Form
        layout='vertical'
        className='w-400 bg-white p-2'
        onFinish={onFinish}
        form={form}
      >
        <h2 className='uppercase my-1 text-center'>
          <strong>MedConnect Login</strong>
        </h2>
        <hr />
        <Form.Item
          label='Email'
          name='email'
          className='my-1'
          rules={[
            { required: true, message: 'Please, input your email!' },
            { type: 'email', message: 'Please, input a valid email!' },
          ]}
          hasFeedback
        >
          <Input type='email' />
        </Form.Item>

        <Form.Item
          label='Password'
          name={'password'}
          rules={[{ required: true }]}
          hasFeedback
        >
          <Input.Password />
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
