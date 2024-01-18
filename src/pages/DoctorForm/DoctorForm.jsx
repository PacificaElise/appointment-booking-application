import {
  Form,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  TimePicker,
  Checkbox,
  Divider,
  message,
} from 'antd';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { addDoctor, checkDoctorApplied } from '../../requests/doctors';
import { useNavigate } from 'react-router-dom';

const CheckboxGroup = Checkbox.Group;
const plainOptions = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const defaultCheckedList = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

const Textarea = Input.TextArea;

function DoctorForm() {
  const [form] = Form.useForm();

  // Filter `option.label` match the user type `input`
  const filterOptionSpec = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const filterSortSpec = (optionA, optionB) =>
    (optionA?.label ?? '')
      .toLowerCase()
      .localeCompare((optionB?.label ?? '').toLowerCase());

  const format = 'HH:mm';

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const onChangeStartTime = (time, timeString) => {
    setStartTime(timeString);
  };

  const onChangeEndTime = (time, timeString) => {
    setEndTime(timeString);
  };

  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChangeDay = (list) => {
    setCheckedList(list);
  };

  const onCheckAllChangeDay = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  // Filter `option.label` match the user type `input`
  const filterOptionQual = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const filterSortQual = (optionA, optionB) =>
    (optionA?.label ?? '')
      .toLowerCase()
      .localeCompare((optionB?.label ?? '').toLowerCase());

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [applied, setApplied] = useState(false);

  const onFinish = async (values) => {
    dispatch(ShowLoader(true));
    try {
      const payload = {
        ...values,
        startTime,
        endTime,
        checkedList,
        userId: JSON.parse(localStorage.getItem('user')).id,
        status: 'pending',
        role: 'doctor',
      };
      const response = await addDoctor(payload);
      if (response.success) {
        message.success(response.message);
        form.resetFields();
        navigate('/profile');
      } else {
        throw new Error(response.message);
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  const checkApplied = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await checkDoctorApplied(
        JSON.parse(localStorage.getItem('user')).id
      );
      if (res.success) {
        setApplied(true);
      }
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    checkApplied();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !applied ? (
    <section className='p-2'>
      <h4 className='uppercase bold'>Apply for a Doctor Account</h4>
      <hr className='my-1' />

      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
      >
        <h4 className='uppercase my-2 bold'>Personal information</h4>
        <Row gutter={[16, 16]}>
          <Col className='col'>
            <Form.Item
              label='First Name'
              name='firstName'
              rules={[
                { required: true, message: 'Please, input your first name!' },
                { whitespace: true },
                { min: 3 },
              ]}
            >
              <Input type='text' />
            </Form.Item>
          </Col>

          <Col className='col'>
            <Form.Item
              label='Last Name'
              name='lastName'
              rules={[
                { required: true, message: 'Please, input your last name!' },
                { whitespace: true },
                { min: 3 },
              ]}
            >
              <Input type='text' />
            </Form.Item>
          </Col>

          <Col className='col'>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Please, input your email!' },
                { type: 'email', message: 'Please, input a valid email!' },
              ]}
            >
              <Input type='email' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col className='col'>
            <Form.Item
              label='Phone'
              name='phone'
              rules={[
                {
                  required: true,
                  message: 'Please, input your phone number!',
                },
                {
                  validator: (_, value) =>
                    value &&
                    value.match(
                      /^(\+)?((\d{2,3}) ?\d|\d)(([ -]?\d)|( ?(\d{2,3}) ?)){5,12}\d$/
                    )
                      ? Promise.resolve()
                      : Promise.reject(
                          'Please, input a phone number without parentheses'
                        ),
                },
              ]}
            >
              <Input type='tel' />
            </Form.Item>
          </Col>

          <Col className='col'>
            <Form.Item
              label='Website'
              name='website'
              rules={[
                {
                  required: true,
                  type: 'url',
                  message: 'Please, input a valid url!',
                },
              ]}
            >
              <Input type='text' />
            </Form.Item>
          </Col>

          <Col className='col'>
            <Form.Item
              label='Address'
              name='address'
              rules={[
                { required: true, message: 'Please, input your address!' },
                { whitespace: true },
              ]}
            >
              <Textarea
                showCount
                maxLength={300}
                style={{
                  height: 100,
                  resize: 'none',
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <hr className='my-1' />
        <h4 className='uppercase my-2 bold'>Professional information</h4>
        <Row gutter={[16, 16]}>
          <Col className='col'>
            <Form.Item
              label='Speciality'
              name='speciality'
              rules={[
                {
                  required: true,
                  message: 'Please, select your speciality!',
                },
              ]}
            >
              <Select
                showSearch
                placeholder='Select a speciality'
                optionFilterProp='children'
                filterOption={filterOptionSpec}
                filterSort={filterSortSpec}
                options={[
                  {
                    value: 'dermatologist',
                    label: 'dermatologist',
                  },
                  {
                    value: 'therapist',
                    label: 'therapist',
                  },
                  {
                    value: 'cardiologist',
                    label: 'cardiologist',
                  },
                  {
                    value: 'neurologist',
                    label: 'neurologist',
                  },
                  {
                    value: 'orthopedist',
                    label: 'orthopedist',
                  },
                  {
                    value: 'ophthalmologist',
                    label: 'ophthalmologist',
                  },
                  {
                    value: 'psychiatrist',
                    label: 'psychiatrist',
                  },
                  {
                    value: 'otolaryngologist',
                    label: 'otolaryngologist',
                  },
                  {
                    value: 'pediatrician',
                    label: 'pediatrician',
                  },
                  {
                    value: 'surgeon',
                    label: 'surgeon',
                  },
                  {
                    value: 'urologist',
                    label: 'urologist',
                  },
                  {
                    value: 'gynecologist',
                    label: 'gynecologist',
                  },
                ]}
              />
            </Form.Item>
          </Col>

          <Col className='col'>
            <Form.Item
              label='Experience, years'
              name='experience'
              rules={[
                { required: true, message: 'Please, enter your experience!' },
              ]}
            >
              <InputNumber
                min={1}
                placeholder='Set years'
              />
            </Form.Item>
          </Col>

          <Col className='col'>
            <Form.Item
              label='Qualification'
              name='qualification'
              rules={[
                {
                  required: true,
                  message: 'Please, select your qualification!',
                },
              ]}
            >
              <Select
                showSearch
                placeholder='Select a qualification'
                optionFilterProp='children'
                filterOption={filterOptionQual}
                filterSort={filterSortQual}
                options={[
                  {
                    value: 'MBBS',
                    label: 'MBBS',
                  },
                  {
                    value: 'MD',
                    label: 'MD',
                  },
                  {
                    value: 'MS',
                    label: 'MS',
                  },
                  {
                    value: 'MDS',
                    label: 'MDS',
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <hr className='my-1' />
        <h4 className='uppercase my-2 bold'>Working hours</h4>
        <Row gutter={[24, 24]}>
          <Col
            span={8}
            className='col'
          >
            <Form.Item
              label='Start Time'
              name='startTime'
              rules={[{ required: true, message: 'Required' }]}
            >
              <TimePicker
                placeholder='Set time'
                format={format}
                value={startTime}
                onChange={onChangeStartTime}
              />
            </Form.Item>
          </Col>

          <Col
            span={8}
            className='col'
          >
            <Form.Item
              label='End Time'
              name='endTime'
              rules={[{ required: true, message: 'Required' }]}
            >
              <TimePicker
                placeholder='Set time'
                format={format}
                value={endTime}
                onChange={onChangeEndTime}
              />
            </Form.Item>
          </Col>

          <Col
            span={8}
            className='col'
          >
            <Form.Item
              label='Fee, $'
              name='fee'
              rules={[{ required: true, message: 'Please, enter a fee' }]}
            >
              <InputNumber
                min={1}
                placeholder='Set fee'
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChangeDay}
            checked={checkAll}
          >
            Check all
          </Checkbox>
          <Divider />
          <CheckboxGroup
            options={plainOptions}
            value={checkedList}
            onChange={onChangeDay}
          />
        </Row>
        <div className='flex items-center gap-2 mt-3 wrap'>
          <button
            className='canceled-btn w-200'
            type='reset'
            onClick={() => navigate('/')}
          >
            Cancel
          </button>

          <button
            className='contained-btn w-200'
            type='submit'
          >
            Submit
          </button>

          <button
            className='canceled-btn w-200'
            type='reset'
          >
            Clear form
          </button>
        </div>
      </Form>
    </section>
  ) : (
    <div className='flex flex-col items-center gap-2 p-2'>
      <h3 className='text-secondary'>
        You have already applied for this account, please, wait for the admin to
        approve your request.
      </h3>
      <button></button>
    </div>
  );
}

export default DoctorForm;
