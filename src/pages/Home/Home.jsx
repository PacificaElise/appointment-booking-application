import { Input, message, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { getDoctors } from '../../requests/doctors';

const Search = Input.Search;

function Home() {
  const navigate = useNavigate();

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await getDoctors();
      if (res.success) {
        setDoctors(res.data);
      } else throw new Error(res.message);
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  useEffect(
    () => {
      getData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <section className='flex flex-column p-2'>
      <div className='flex justify-between wrap gap-2'>
        <Search
          placeholder='Search a doctor'
          className='w-300'
          onSearch={onSearch}
          allowClear
        />

        <button
          className='contained-btn my-1 p-1'
          onClick={() => navigate('/apply-doctor')}
        >
          Apply Doctor
        </button>
      </div>
      <Row
        gutter={[16, 16]}
        className='flex m-2 gap-2'
      >
        {doctors.map((doctor) => {
          return (
            <Col
              key={doctor.id}
              className='block p-1 flex flex-column gap-1 cursor-pointer'
              onClick={() => navigate(`/book-appointment/${doctor.id}`)}
            >
              <div className='flex justify-between items-center gap-2'>
                <h2 className='uppercase'>
                  {doctor.firstName} {doctor.lastName}
                </h2>
              </div>
              <hr />
              <div className='flex justify-between items-center gap-2'>
                <h5>Speciality:</h5>
                <h4 className='uppercase'>{doctor.speciality}</h4>
              </div>
              <div className='flex justify-between items-center gap-2'>
                <h5>Experience:</h5>
                <h4>{doctor.experience} years</h4>
              </div>
              <div className='flex justify-between items-center gap-2'>
                <h5>Fee:</h5>
                <h4 className='uppercase'>{doctor.fee} $</h4>
              </div>
              <div className='flex justify-between items-center gap-2'>
                <h5>Email:</h5>
                <h4>{doctor.email}</h4>
              </div>
              <div className='flex justify-between items-center gap-2'>
                <h5>Phone:</h5>
                <h4>{doctor.phone}</h4>
              </div>
            </Col>
          );
        })}
      </Row>
    </section>
  );
}

export default Home;
