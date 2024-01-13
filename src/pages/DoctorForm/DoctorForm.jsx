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

import dayjs from 'dayjs';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { addDoctor } from '../../requests/doctors';
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

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoader(true));
      const payload = {
        ...values,
        checkedList,
        userId: JSON.parse(localStorage.getItem('user')).id,
      };
      const response = await addDoctor(payload);
      if (response.success) {
        message.success(response.message);
        form.resetFields();
        navigate('/profile');
      } else {
        console.log(payload, response.message);
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  return (
    <section className='p-2'>
      <h4 className='uppercase'>Apply for a Doctor Account</h4>
      <hr className='my-1' />

      <Form
        layout='vertical'
        onFinish={onFinish}
        form={form}
      >
        <h4 className='uppercase my-2'>Personal information</h4>
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
                { required: true, message: 'Please, input your phone number!' },
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
              <Textarea />
            </Form.Item>
          </Col>
        </Row>

        <hr className='my-1' />
        <h4 className='uppercase my-2'>Professional information</h4>
        <Row gutter={[16, 16]}>
          <Col className='col'>
            <Form.Item
              label='Speciality'
              name='speciality'
              rules={[
                { required: true, message: 'Please, select your speciality!' },
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
                defaultValue={1}
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
        <h4 className='uppercase my-2'>Working hours</h4>
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
                defaultValue={dayjs('09:00', format)}
                format={format}
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
                defaultValue={dayjs('18:00', format)}
                format={format}
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
                defaultValue={1}
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
        <div className='flex justify-end items-center gap-2 mt-3'>
          <button
            className='canceled-btn w-300'
            type='reset'
          >
            Cancel
          </button>
          <button
            className='contained-btn w-300'
            type='submit'
          >
            Submit
          </button>
        </div>
      </Form>
    </section>
  );
}

export default DoctorForm;
