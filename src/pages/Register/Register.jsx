import { useEffect, useState } from 'react';
import { Form, message, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../../requests/users';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';

function Register() {
  const [form] = Form.useForm();
  const password = Form.useWatch('password', form);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [percentBar, setPercentBar] = useState('');
  const [passLabel, setPassLabel] = useState('Strength');

  const addClass = (className) => {
    setPercentBar('');
    if (className) {
      setPercentBar(className);
    }
  };

  const handlePass = () => {
    if (password?.length === 0) {
      setPassLabel('Strength');
      addClass();
    } else if (password?.length <= 4) {
      setPassLabel('Weak');
      addClass('weak');
    } else if (password?.length <= 7) {
      setPassLabel('Not Bad');
      addClass('average');
    } else {
      setPassLabel('Strong');
      addClass('strong');
    }
  };

  const onFinish = async (values) => {
    dispatch(ShowLoader(true));
    try {
      const res = await createUser({
        ...values,
        role: 'user',
      });
      if (res.success) {
        message.success(res.message);
        form.resetFields();
        addClass();
        setPassLabel('Strength');
        navigate('/login');
      } else {
        throw new Error(res.message);
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) navigate('/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className='flex justify-center items-center h-screen'>
      <Form
        layout='vertical'
        className='w-400 bg-white p-2 py-1'
        onFinish={onFinish}
        form={form}
      >
        <h2 className='uppercase my-1 text-center text-primary'>
          <span className='text-secondary'>Med</span>Connect Register
        </h2>
        <hr />
        <Form.Item
          label='Name'
          name='name'
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
          onChange={handlePass}
          rules={[
            { required: true },
            { min: 6 },
            {
              validator: (_, value) =>
                value &&
                value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^\w\s])/)
                  ? Promise.resolve()
                  : Promise.reject(
                      'The password must contain numbers, at least one uppercase and lowercase letters and a symbol'
                    ),
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <div className='pass-strength'>
          <div className='strength-percent'>
            <span className={percentBar}></span>
          </div>
          <span className='strength-label'>{passLabel}</span>
        </div>

        <Form.Item
          label='Confirm password'
          name='confirmPassword'
          dependencies={['password']}
          className='my-1'
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
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
          className='contained-btn my-1 w-full'
          type='submit'
        >
          register
        </button>
        <Link
          className='underline link'
          to='/login'
        >
          Already have an account? <strong>Sign In</strong>
        </Link>
      </Form>
    </section>
  );
}

export default Register;
