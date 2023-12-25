import { Form, message, Input } from 'antd';
import { Link } from 'react-router-dom';
import { createUser } from '../../requests/users';

function Register() {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await createUser(values);
      if (res.success) {
        message.success(res.message);
        form.resetFields();
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
        className='w-400 bg-white p-2 py-1'
        onFinish={onFinish}
        form={form}
      >
        <h2 className='uppercase my-1 text-center'>
          <strong>MedConnect Register</strong>
        </h2>
        <hr />
        <Form.Item
          label='Name'
          name='Name'
          className='my-1'
          rules={[
            { required: true, message: 'Please, input your name!' },
            { whitespace: true },
            { min: 3 },
          ]}
          hasFeedback
        >
          <Input type='text' />
        </Form.Item>

        <Form.Item
          label='Email'
          name='Email'
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
          name='Password'
          rules={[{ required: true }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label='Confirm password'
          name='ConfirmPassword'
          dependencies={['Password']}
          className='my-1'
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('Password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords don't match!");
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <button
          className='contained-btn my-1'
          type='submit'
        >
          register
        </button>
        <Link
          className='underline'
          to='/login'
        >
          Already have an account? <strong>Sign In</strong>
        </Link>
      </Form>
    </div>
  );
}

export default Register;
