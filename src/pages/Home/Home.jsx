import { Input, message, Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { getDoctors } from '../../requests/doctors';
import Highlighter from 'react-highlight-words';

const Search = Input.Search;

function Home() {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState([]);

  const onSearch = (value, _e, info) => {
    const results = doctors.filter((doctor) => {
      return (
        doctor.firstName.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        doctor.lastName.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
        doctor.speciality.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    });
    if (results.length > 0) {
      setSearch(results);
    } else setSearch(doctors);
  };

  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await getDoctors();
      if (res.success) {
        setDoctors(res.data.map((d, i) => ({ ...d, order: i })));
      } else throw new Error(res.message);
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(
    () => {
      getData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [currentDoctorCard, setCurrentDoctorCard] = useState(null);

  const dragStartHandler = (e, doctor) => {
    setCurrentDoctorCard(doctor);
  };

  const dragEndHandler = (e) => {
    e.target.style.backgroundColor = '#fff';
  };

  const dragOverHandler = (e) => {
    e.preventDefault();
    e.target.style.backgroundColor = '#eee';
  };

  const dropHandler = (e, doctor) => {
    e.preventDefault();
    (search.length > 0 ? setSearch : setDoctors)(
      doctors.map((d) => {
        if (d.id === doctor.id) {
          return { ...d, order: currentDoctorCard.order };
        }
        if (d.id === currentDoctorCard.id) {
          return { ...d, order: doctor.order };
        }
        return d;
      })
    );
    e.target.style.backgroundColor = '#fff';
  };

  const sortDoctors = (a, b) => {
    if (a.order > b.order) return 1;
    else return -1;
  };

  const [searchQuery, setsearchQuery] = useState('');

  const onChange = (e) => {
    setsearchQuery(e.target.value);
  };

  return (
    user && (
      <section className='flex flex-column p-2'>
        <div className='flex justify-between wrap gap-2'>
          <Search
            placeholder='Search a doctor'
            className='w-300'
            onSearch={onSearch}
            onChange={onChange}
            allowClear
          />

          {user?.role === 'user' && (
            <button
              className='contained-btn my-1 p-1'
              onClick={() => navigate('/apply-doctor')}
            >
              Apply Doctor
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              className='contained-btn my-1 p-1'
              onClick={() => navigate('/admin')}
            >
              Approve Doctor
            </button>
          )}
        </div>
        <Row
          gutter={[16, 16]}
          className='flex m-2 gap-2'
        >
          {(search.length ? search : doctors)
            .sort(sortDoctors)
            .filter((doctor) => doctor.status === 'approved')
            .map((doctor) => {
              return (
                <Col
                  key={doctor.id}
                  className='block p-1 flex flex-column gap-1 cursor-grab'
                  draggable={true}
                  onDragStart={(e) => dragStartHandler(e, doctor)}
                  onDragLeave={(e) => dragEndHandler(e)}
                  onDragEnd={(e) => dragEndHandler(e)}
                  onDragOver={(e) => dragOverHandler(e)}
                  onDrop={(e) => dropHandler(e, doctor)}
                >
                  <div className='flex justify-start items-center gap-1'>
                    <h2 className='uppercase'>
                      <Highlighter
                        highlightStyle={{
                          backgroundColor: '#ffc069',
                          padding: 0,
                        }}
                        searchWords={[searchQuery]}
                        autoEscape={true}
                        textToHighlight={doctor.firstName}
                      />
                    </h2>
                    <h2 className='uppercase'>
                      <Highlighter
                        highlightStyle={{
                          backgroundColor: '#ffc069',
                          padding: 0,
                        }}
                        searchWords={[searchQuery]}
                        autoEscape={true}
                        textToHighlight={doctor.lastName}
                      />
                    </h2>
                  </div>
                  <hr />
                  <div className='flex justify-between items-center gap-1'>
                    <h5>Speciality:</h5>

                    <h4 className='uppercase'>
                      <Highlighter
                        highlightStyle={{
                          backgroundColor: '#ffc069',
                          padding: 0,
                        }}
                        searchWords={[searchQuery]}
                        autoEscape={true}
                        textToHighlight={doctor.speciality}
                      />
                    </h4>
                  </div>
                  <div className='flex justify-between items-center gap-1'>
                    <h5>Experience:</h5>
                    <h4>{doctor.experience} years</h4>
                  </div>
                  <div className='flex justify-between items-center gap-1'>
                    <h5>Fee:</h5>
                    <h4 className='uppercase'>{doctor.fee} $</h4>
                  </div>
                  <div className='flex justify-between items-center gap-1'>
                    <h5>Email:</h5>
                    <h4>{doctor.email}</h4>
                  </div>
                  <div className='flex justify-between items-center gap-1'>
                    <h5>Phone:</h5>
                    <h4>{doctor.phone}</h4>
                  </div>
                  <button
                    className='contained-btn cursor-pointer my-1 p-1'
                    onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                  >
                    Apply Appointment
                  </button>
                </Col>
              );
            })}
        </Row>
      </section>
    )
  );
}

export default Home;
