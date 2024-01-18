import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShowLoader } from '../../redux/loaderSlice';
import { message, DatePicker, Input } from 'antd';
import { getDoctorById } from '../../requests/doctors';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import {
  bookAppointment,
  getDoctorAppointmentsOnDate,
} from '../../requests/books';
import dayjs from 'dayjs';

const disabledDate = (current) => {
  return current && current < dayjs().endOf('day');
};

const { TextArea } = Input;

function BookAppointment() {
  const [date, setDate] = useState('');
  const [doctor, setDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState([]);
  const [problem, setProblem] = useState('');

  const navigate = useNavigate();

  const onChange = (date, dateString) => {
    setSelectedSlot('');
    setDate(dateString);
  };

  const onChangeReason = (e) => {
    setProblem(e.target.value);
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
    } catch (error) {
      message.error(error.message);
    } finally {
    }
    dispatch(ShowLoader(false));
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
    let startTime = moment(doctor.startTime, 'hh:mm');
    let endTime = moment(doctor.endTime, 'hh:mm');
    let slotDuration = 60; // im minutes
    let slots = [];
    while (startTime < endTime) {
      slots.push(startTime.format('hh:mm'));
      startTime.add(slotDuration, 'minutes');
    }
    return slots.map((slot) => {
      const isBooked = bookedSlots?.find(
        (bookedSlot) => bookedSlot.slot === slot && slot.status !== 'cancelled'
      );
      return (
        <div
          className='bg-white slot p-1'
          key={slot}
          onClick={() => {
            setSelectedSlot(slot);
          }}
          style={{
            border:
              selectedSlot === slot ? '2px solid #205e61' : '1px solid #979696',
            backgroundColor: isBooked ? '#d6d6d6' : 'fff',
            pointerEvents: isBooked ? 'none' : 'auto',
            cursor: isBooked ? 'not-allowed' : 'pointer',
          }}
        >
          <span>
            {moment(slot, 'hh:mm').format('hh:mm a')} - {''}
            {moment(slot, 'hh:mm')
              .add(slotDuration, 'minutes')
              .format('hh:mm a')}
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
        bookedOn: moment().format('DD-MM-YYYY hh:mm a'),
        problem,
        status: 'pending',
      };
      const res = await bookAppointment(payload);
      if (res.success) {
        message.success(res.message);
        navigate('/profile');
      } else throw new Error(res.message);
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
    }
  };

  const getBookedSlots = async () => {
    dispatch(ShowLoader(true));
    try {
      const res = await getDoctorAppointmentsOnDate(id, date);
      if (res.success) {
        setBookedSlots(res.data);
      } else throw new Error(res.message);
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(ShowLoader(false));
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
              <h4>{doctor.fee} $ /per session</h4>
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
        <div className='flex gap-2 wrap my-2'>{date && getSlotsData()}</div>{' '}
        {selectedSlot && (
          <TextArea
            className='w-400'
            showCount
            maxLength={300}
            onChange={onChangeReason}
            placeholder='Enter your problem here'
            style={{
              height: 120,
              resize: 'none',
              padding: 10,
              marginTop: 10,
              marginBottom: 20,
            }}
          />
        )}
        <p className='flex gap-2 wrap'>
          {selectedSlot && (
            <button
              className='contained-btn p-1 w-200'
              onClick={onBook}
            >
              Book appointment
            </button>
          )}

          <button
            className='canceled-btn p-1 w-200'
            onClick={() => {
              setSelectedSlot('');
              navigate('/');
            }}
          >
            Cancel
          </button>
        </p>
      </section>
    )
  );
}

export default BookAppointment;
