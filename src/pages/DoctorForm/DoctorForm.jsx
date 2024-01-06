import { Form, Row, Col, Input, Select, InputNumber, TimePicker } from 'antd';

const Textarea = Input.TextArea;

function DoctorForm() {
  const onChangeNumber = (value) => {
    console.log('changed', value);
  };

  const onChangeSpec = (value) => {
    console.log(`selected ${value}`);
  };

  const onChangeTime = (time, timeString) => {
    console.log(time, timeString);
  };

  const onSearchSpec = (value) => {
    console.log('search:', value);
  };

  // Filter `option.label` match the user type `input`
  const filterOptionSpec = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const filterSortSpec = (optionA, optionB) =>
    (optionA?.label ?? '')
      .toLowerCase()
      .localeCompare((optionB?.label ?? '').toLowerCase());

  const onChangeQual = (value) => {
    console.log(`selected ${value}`);
  };

  const onSearchQual = (value) => {
    console.log('search:', value);
  };

  // Filter `option.label` match the user type `input`
  const filterOptionQual = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const filterSortQual = (optionA, optionB) =>
    (optionA?.label ?? '')
      .toLowerCase()
      .localeCompare((optionB?.label ?? '').toLowerCase());

  return (
    <section className='p-2'>
      <h4 className='uppercase'>Apply for a Doctor Account</h4>
      <hr className='my-1' />

      <Form layout='vertical'>
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
              rules={[{ type: 'url', message: 'Please, input a valid url!' }]}
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

        <h4 className='uppercase'>Professional information</h4>
        <hr className='my-1' />
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
                onChange={onChangeSpec}
                onSearch={onSearchSpec}
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
              label='Experience'
              name='experience'
            >
              <InputNumber
                min={1}
                defaultValue={1}
                onChange={onChangeNumber}
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
                onChange={onChangeQual}
                onSearch={onSearchQual}
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

        <h4 className='uppercase'>Working hours</h4>
        <hr className='my-1' />
        <Row gutter={[16, 16]}>
          <Col className='col'>
            <Form.Item
              label='Start Time'
              name='startTime'
              rules={[
                { required: true, message: 'Required' },
                { whitespace: true },
              ]}
            >
              <TimePicker
                use12Hours
                format='h:mm a'
                onChange={onChangeTime}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </section>
  );
}

export default DoctorForm;
