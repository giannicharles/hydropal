import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CContainer,
  CRow,
  CCol,
  CFormInput,
  CFormSwitch,
  CSpinner // Added spinner
} from '@coreui/react';
import api from '../../../services/Api'; // Import API service

// Variable to track end of day
const end = new Date();
end.setUTCHours(23,59,59,999);

// Variables to track current date and time
const currDate = new Date().toLocaleDateString();
const currTime = new Date().toLocaleTimeString();

// SVG Icons Component with consistent 60px height
const WaterIcons = {
  Cup: () => (
    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#0ea5e9" version="1.1" id="Capa_1" width="60" height="60" viewBox="0 0 407.551 407.552" xml:space="preserve">
	    <path d="M298.776,121.703h-15.69c-0.111-6.806-5.655-12.292-12.488-12.292h-48.521L203.595,52.12   
               c-0.767-2.375-2.227-4.468-4.193-6.006L143.87,2.656c-5.438-4.254-13.295-3.295-17.548,2.141   
               c-4.256,5.437-3.297,13.293,2.14,17.548l52.518,41.098l14.829,45.97h-58.853c-6.833,0-12.377,5.485-12.489,12.292h-15.691   
               c-6.903,0-12.5,5.597-12.5,12.5c0,6.903,5.597,12.5,12.5,12.5h0.791l21.109,249.4c0.548,6.472,5.959,11.446,12.455,11.446h121.289   
               c6.494,0,11.908-4.975,12.455-11.446l21.108-249.4h0.793c6.903,0,12.5-5.597,12.5-12.5   
               C311.276,127.302,305.679,121.703,298.776,121.703z M252.934,382.549h-98.316l-7.303-86.275h14.889   
               c4.031,26.827,20.846,46.399,41.572,46.399c20.727,0,37.541-19.572,41.572-46.399h14.888L252.934,382.549z M186.276,283.774   
               c0-19.402,9.239-33.9,17.5-33.9c8.26,0,17.5,14.498,17.5,33.9c0,19.401-9.24,33.899-17.5,33.899   
               C195.515,317.673,186.276,303.176,186.276,283.774z M262.352,271.274h-17.004c-4.031-26.827-20.846-46.4-41.572-46.4   
               c-20.726,0-37.541,19.573-41.572,46.4H145.2l-10.544-124.571h138.239L262.352,271.274z"/>
    </svg>
  ),
  Jar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="#0ea5e9" width="65px" height="65px" viewBox="-6 -7.1 24 24">
      <path d="M12 5.05V6H2V4h8V2H2v12h8V6h2v5.95a2.5 2.5 0 0 0 2-2.457V7.507a2.508 2.508 0 0 0-2-2.457zm0-2.022c2.25.249 4 2.159 4 4.478v1.988a4.508 4.508 0 0 1-4 4.478V16H0V0h12v3.028z" fill-rule="evenodd"/>
    </svg>
  ),
  Bottle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="80px" height="130px" viewBox="-19.97 3 53.118 64.118">
      <g id="Group_325" data-name="Group 325" transform="translate(-307.296 -319.387)">
        <g id="Group_265" data-name="Group 265">
          <g id="vine_bottle" data-name="vine bottle">
            <g id="Group_262" data-name="Group 262">
              <path id="Path_207" data-name="Path 207" d="M314.89,374.505c-3.78,0-7.594-.96-7.594-3.1v-27.53c0-3.138,1.547-3.9,2.676-4.452.951-.467,1.474-.725,1.474-2.42v-13.79a1,1,0,0,1,2,0V337c0,2.941-1.5,3.677-2.592,4.215-.972.477-1.558.765-1.558,2.657v27.448c.309.377,2.218,1.186,5.594,1.186s5.284-.809,5.593-1.186V343.871c0-1.892-.586-2.18-1.558-2.657-1.094-.538-2.592-1.274-2.592-4.215v-13.79a1,1,0,0,1,2,0V337c0,1.7.523,1.953,1.474,2.42,1.129.555,2.676,1.314,2.676,4.452V371.4C322.483,373.545,318.669,374.505,314.89,374.505Z" fill="#0ea5e9"/>
            </g>
            <g id="Group_263" data-name="Group 263">
              <path id="Path_208" data-name="Path 208" d="M314.89,361.014c-3.78,0-7.594-.959-7.594-3.1a1,1,0,0,1,2-.087c.3.375,2.209,1.19,5.6,1.19s5.3-.815,5.6-1.19a1,1,0,0,1,2,.087C322.483,360.055,318.669,361.014,314.89,361.014Z" fill="#0ea5e9"/>
            </g>
            <g id="Group_264" data-name="Group 264">
              <path id="Path_209" data-name="Path 209" d="M314.89,353.227c-3.78,0-7.594-.96-7.594-3.1a1,1,0,0,1,2-.086c.3.374,2.208,1.19,5.6,1.19s5.3-.816,5.6-1.19a1,1,0,0,1,2,.086C322.483,352.267,318.669,353.227,314.89,353.227Z" fill="#0ea5e9"/>
            </g>
          </g>
        </g>
        <g id="Group_296" data-name="Group 296">
          <path id="Path_233" data-name="Path 233" d="M314.895,324.406c-2.423,0-4.183-1.055-4.183-2.509s1.76-2.51,4.183-2.51,4.183,1.055,4.183,2.51S317.318,324.406,314.895,324.406Zm-2.1-2.509a4.6,4.6,0,0,0,4.208,0,4.595,4.595,0,0,0-4.208,0Z" fill="#0ea5e9"/>
        </g>
        <g id="Group_297" data-name="Group 297">
          <path id="Path_234" data-name="Path 234" d="M314.89,327.41a6.05,6.05,0,0,1-2.935-.671,1,1,0,0,1,.99-1.738,5.118,5.118,0,0,0,3.89,0,1,1,0,0,1,.99,1.738A6.055,6.055,0,0,1,314.89,327.41Z" fill="#0ea5e9"/>
        </g>
      </g>
    </svg>
  ),
  Drop: () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" fill="#A5D8FF" />
      <path d="M12 6C16 6 19 9.6 19 14C19 18.4 16 22 12 22C8 22 5 18.4 5 14C5 9.6 8 6 12 6Z" fill="#A5D8FF" />
    </svg>
  )
};

// Water bottle visualization component
const WaterBottle = ({ currentMl, goalMl }) => {
  const fillPercentage = Math.min((currentMl / goalMl) * 100, 100);
  
  const smileProgress = Math.min(fillPercentage / 100, 1);
  const mouthCurve = -20 + (40 * smileProgress);
  const mouthY = 75 - (15 * smileProgress);
  const eyeType = smileProgress > 0.7 ? 'happy' : smileProgress > 0.3 ? 'neutral' : 'sad';

  return (
    <div className="d-flex justify-content-center mb-3" style={{ height: '200px' }}>
      <div style={{ position: 'relative', width: '120px', height: '200px' }}>
        {/* Bottle outline */}
        <svg width="120" height="200" viewBox="0 0 120 200" style={{ position: 'absolute', top: 0, left: 0 }}>
          <rect x="45" y="5" width="30" height="10" rx="2" fill="#0ea5e9" />
          <rect x="40" y="15" width="40" height="15" rx="2" fill="none" stroke="#0ea5e9" strokeWidth="2" />
          <path
            d="M 20 30 L 20 180 Q 20 190 30 190 L 90 190 Q 100 190 100 180 L 100 30 Z"
            fill="none"
            stroke="#0ea5e9"
            strokeWidth="2"
          />
        </svg>

        {/* Water fill */}
        <svg width="120" height="200" viewBox="0 0 120 200" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <clipPath id="bottleClip">
              <path d="M 23 30 L 23 178 Q 23 188 30 188 L 90 188 Q 97 188 97 178 L 97 30 Z"/>
            </clipPath>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <rect
            x="23"
            y={188 - (158 * fillPercentage / 100)}
            width="74"
            height={158 * fillPercentage / 100}
            fill="url(#waterGradient)"
            clipPath="url(#bottleClip)"
            style={{ transition: 'all 0.8s ease-in-out' }}
          />
        </svg>

        {/* Smiley face */}
        <svg
          width="70"
          height="70"
          viewBox="0 0 100 100"
          fill="none"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {eyeType === 'happy' ? (
            <>
              <path d="M25 30 Q30 20 35 30" stroke="black" strokeWidth="3" strokeLinecap="round" />
              <path d="M65 30 Q70 20 75 30" stroke="black" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : eyeType === 'neutral' ? (
            <>
              <line x1="25" y1="30" x2="35" y2="30" stroke="black" strokeWidth="3" />
              <line x1="65" y1="30" x2="75" y2="30" stroke="black" strokeWidth="3" />
            </>
          ) : (
            <>
              <path d="M25 35 Q30 45 35 35" stroke="black" strokeWidth="3" strokeLinecap="round" />
              <path d="M65 35 Q70 45 75 35" stroke="black" strokeWidth="3" strokeLinecap="round" />
            </>
          )}
          <path
            d={`M25 ${mouthY} Q50 ${mouthY + mouthCurve} 75 ${mouthY}`}
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
};

// Success celebration component
const SuccessMessage = ({ show, amount, unit }) => {
  if (!show) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#10b981',
        color: 'white',
        padding: '20px 30px',
        borderRadius: '15px',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
        zIndex: 1000,
        animation: 'fadeInOut 2s ease-in-out forwards'
      }}
    >
      <h4 style={{ margin: '0 0 24 24' }}>Great job! 🎉</h4>
      <p style={{ margin: 0 }}>You added {amount} {unit}!</p>
      
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
          20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        }
      `}</style>
    </div>
  );
};

// Main water intake tracking component
const Water = () => {
  const [totalMl, setTotalMl] = useState(0);
  const [customAmount, setCustomAmount] = useState('');
  const [unit, setUnit] = useState('ml');
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastAddedAmount, setLastAddedAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [goalMl, setGoalMl] = useState(2500);

  const OZ_TO_ML = 29.5735;

  // Fetch today's water
  useEffect(() => {
    const fetchTodayWater = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/api/auth/water/today');
        setTotalMl(response.data.total || 0);
      } catch (error) {
        console.error('Failed to fetch today\'s water:', error);
        alert('Failed to load water data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTodayWater();
  }, []);

  const convert = (ml) => {
    return unit === 'ml'
      ? `${Math.round(ml)} ml`
      : `${(ml / OZ_TO_ML).toFixed(1)} oz`;
  };

  const addWater = async (amount) => {
    const amountInMl = unit === 'ml' ? amount : amount * OZ_TO_ML;
    
    try {
      await api.post('/api/auth/water', { amount: amountInMl });
      setTotalMl(prev => prev + amountInMl);
      setLastAddedAmount(amount);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to log water:', error);
      alert('Failed to save water intake. Please try again.');
    }
  };

  const handleCustomAdd = () => {
    const num = parseFloat(customAmount);
    if (!isNaN(num) && num > 0) {
      addWater(num);
      setCustomAmount('');
    } else {
      alert('Please enter a valid positive number');
    }
  };

  const clearTotal = async () => {
    if (window.confirm('Are you sure you want to reset today\'s progress?')) {
      try {
        // Delete today's logs from backend
        const response = await api.delete('/api/auth/water/today');
        
        // Only reset if deletion was successful
        if (response.data.success) {
          setTotalMl(0);
        } else {
          throw new Error('Failed to reset progress on the server');
        }
      } catch (error) {
        console.error('Failed to reset water data:', error);
        alert('Failed to reset progress. Please try again.');
      }
    }
  };

  
  const progressPercentage = Math.min((totalMl / goalMl) * 100, 100);

  if (isLoading) {
    return (
      <CContainer className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <CSpinner color="primary" />
      </CContainer>
    );
  }

  return (
    <CContainer className="py-4" style={{ maxWidth: '500px' }}>
      <SuccessMessage show={showSuccess} amount={lastAddedAmount} unit={unit} />
      
      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">💧 Water Intake Tracker</h4>
          <div className="d-flex align-items-center">
            <span className="me-2">{unit === 'ml' ? 'ml' : 'oz'}</span>
            <CFormSwitch
              checked={unit === 'oz'}
              onChange={() => setUnit(prev => (prev === 'ml' ? 'oz' : 'ml'))}
            />
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="text-center mb-3">
            <h5 className="text-body-secondary mb-2">
              {progressPercentage >= 100 ? 'Goal Achieved! 🏆' : 'Daily Progress'}
            </h5>
            <WaterBottle currentMl={totalMl} goalMl={goalMl} />
            <div style={{ marginTop: '10px' }}>
              <h2 className="text-primary mb-1">{convert(totalMl)}</h2>
              <p className="text-body-secondary mb-2">
                Goal: {convert(goalMl)} ({progressPercentage.toFixed(0)}%)
              </p>
              <div className="progress mx-auto" style={{ width: '200px', height: '6px' }}>
                <div
                  className="progress-bar bg-primary"
                  role="progressbar"
                  style={{ width: `${progressPercentage}%`, transition: 'width 0.8s ease-in-out' }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            </div>
          </div>

          <CRow className="text-center mb-3">
            <CCol xs={4}>
              <div className="mb-2">
                <div style={{ height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <WaterIcons.Cup />
                </div>
                <small className="text-body-secondary d-block">
                  {unit === 'ml' ? '250 ml' : '8.5 oz'}
                </small>
              </div>
              <CButton 
                color="primary"
                className="rounded-circle"
                style={{ width: '40px', height: '40px', padding: 0 }}
                onClick={() => addWater(unit === 'ml' ? 250 : 8.5)}
              >
                +
              </CButton>
            </CCol>
            <CCol xs={4}>
              <div className="mb-2">
                <div style={{ height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <WaterIcons.Jar />
                </div>
                <small className="text-body-secondary d-block">
                  {unit === 'ml' ? '500 ml' : '17 oz'}
                </small>
              </div>
              <CButton 
                color="primary"
                className="rounded-circle"
                style={{ width: '40px', height: '40px', padding: 0 }}
                onClick={() => addWater(unit === 'ml' ? 500 : 17)}
              >
                +
              </CButton>
            </CCol>
            <CCol xs={4}>
              <div className="mb-2">
                <div style={{ height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <WaterIcons.Bottle />
                </div>
                <small className="text-body-secondary d-block">
                  {unit === 'ml' ? '1000 ml' : '34 oz'}
                </small>
              </div>
              <CButton 
                color="primary"
                className="rounded-circle"
                style={{ width: '40px', height: '40px', padding: 0 }}
                onClick={() => addWater(unit === 'ml' ? 1000 : 34)}
              >
                +
              </CButton>
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol xs={8}>
              <CFormInput
                type="number"
                min="1"
                placeholder={`Enter custom amount (${unit})`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="rounded-3"
                style={{ fontSize: '16px', padding: '10px' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomAdd();
                  }
                }}
              />
            </CCol>
            <CCol xs={4}>
              <CButton 
                color="primary"
                className="rounded-3 w-100"
                style={{ height: '42px' }}
                onClick={handleCustomAdd}
                disabled={!customAmount || parseFloat(customAmount) <= 0}
              >
                Add
              </CButton>
            </CCol>
          </CRow>

          <div className="text-center mt-2">
            <CButton 
              color="danger"
              variant="outline"
              onClick={clearTotal}
              className="rounded-3"
              size="sm"
            >
              Reset Today's Progress
            </CButton>
          </div>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default Water;
