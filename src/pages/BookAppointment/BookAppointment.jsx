import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { message, DatePicker } from 'antd';
import { getDoctorById } from '../../requests/doctors';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { bookAppointment, getDoctorAppointments } from '../../requests/books';
import dayjs from 'dayjs';

const disabledDate = (current) => {
  return current && current < dayjs().endOf('day');
};

function BookAppointment() {
  const [date, setDate] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);

  const navigate = useNavigate();

  const onChange = (date, dateString) => {
    setDate(dateString);
  };

  const { id } = useParams();

  const dispatch = useDispatch();

  const getData = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await getDoctorById(id);
      if (res.success) {
        setDoctor(res.data);
      } else throw new Error(res.message);
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  const getSlotsData = () => {
    const day = moment(date).format('dddd');
    if (!doctor.checkedList.includes(day)) {
      return (
        <h3 className='warn'>
          Doctor is not available on {moment(date).format('DD-MM-YYYY')}
        </h3>
      );
    }
    let startTime = moment(doctor.startTime, 'HH:mm');
    let endTime = moment(doctor.endTime, 'HH:mm');
    let slotDuration = 60; // im minutes
    let slots = [];
    while (startTime < endTime) {
      if (
        !bookedSlots.find((slot) => slot.slot === startTime.format('HH:mm'))
      ) {
        slots.push(startTime.format('HH:mm'));
      }
      startTime.add(slotDuration, 'minutes');
    }
    return slots.map((slot) => {
      return (
        <div
          className='bg-white cursor-pointer slot p-1'
          key={slot}
          onClick={() => setSelectedSlot(slot)}
          style={{
            border:
              selectedSlot === slot ? '2px solid #205e61' : '1px solid #979696',
          }}
        >
          <span>
            {moment(slot, 'HH:mm A').format('HH:mm A')} - {''}
            {moment(slot, 'HH:mm A')
              .add(slotDuration, 'minutes')
              .format('HH:mm A')}
          </span>
        </div>
      );
    });
  };

  const onBook = async () => {
    dispatch(ShowLoader(true));
    try {
      const payload = {
        doctorId: id,
        userId: JSON.parse(localStorage.getItem('user')).id,
        date,
        slot: selectedSlot,
        doctorName: `${doctor.firstName} ${doctor.lastName}`,
        userName: JSON.parse(localStorage.getItem('user')).name,
        bookedOn: moment().format('DD-MM-YYYY HH:mm A'),
      };
      const res = await bookAppointment(payload);
      if (res.success) {
        message.success(res.message);
        navigate('/profile');
      } else throw new Error(res.message);
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  const getBookedSlots = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await getDoctorAppointments(id, date);
      if (res.success) {
        setBookedSlots(res.data);
      } else throw new Error(res.message);
      dispatch(ShowLoader(false));
    } catch (error) {
      dispatch(ShowLoader(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (date) {
      getBookedSlots();
    }
  }, [date]);

  useEffect(() => {
    getData();
  }, [id]);

  return (
    doctor && (
      <section className='p-2'>
        <h1 className='name uppercase bold'>
          {doctor.firstName} {doctor.lastName}
        </h1>
        <hr className='my-1' />
        <div className='doctor-card'>
          <div className='flex flex-column gap-1'>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Speciality:</h5>
              <h4 className='uppercase'>{doctor.speciality}</h4>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Experience:</h5>
              <h4>{doctor.experience} years</h4>
            </div>

            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Email:</h5>
              <h4>{doctor.email}</h4>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Phone:</h5>
              <h4>{doctor.phone}</h4>
            </div>

            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Fee:</h5>
              <h4>{doctor.fee} $ per session</h4>
            </div>
            <div className='flex justify-between items-center gap-2'>
              <h5 className='bold'>Available days:</h5>
              <h4 className='text-right'>{doctor.checkedList.join(', ')}</h4>
            </div>
          </div>
          <hr className='my-1' />
          <p className='my-1'>Select date:</p>
          <div className='flex flex-column'>
            <div className='flex gap-2 justify-between'>
              <DatePicker
                disabledDate={disabledDate}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        <div className='flex gap-2 wrap my-2'>{date && getSlotsData()}</div>
        <p className='flex gap-3 wrap'>
          <button
            className='canceled-btn p-1 w-200'
            onClick={() => {
              setSelectedSlot('');
              navigate('/');
            }}
          >
            Cancel
          </button>
          {selectedSlot && (
            <button
              className='contained-btn p-1 w-200'
              onClick={onBook}
            >
              Book appointment
            </button>
          )}
        </p>
      </section>
    )
  );
}

export default BookAppointment;
