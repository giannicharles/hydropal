import React, { useState, useEffect, useRef } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CContainer,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CSpinner
} from '@coreui/react';
import { cilRecycle, cilChart, cilWarning } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const Plastics = () => {
  const [values, setValues] = useState({
    bottles: 0,
    bags: 0,
    straws: 0,
    packaging: 0,
    containers: 0
  });
  
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState('week');
  
  // Refs for progress bars
  const marineBarRef = useRef(null);
  const carbonBarRef = useRef(null);
  const landfillBarRef = useRef(null);
  
  // Progress bar instances
  const marineProgress = useRef(null);
  const carbonProgress = useRef(null);
  const landfillProgress = useRef(null);

  // Average plastic weights (in grams)
  const plasticWeights = {
    bottle: 10,
    bag: 5,
    straw: 0.5,
    packaging: 15,
    container: 20
  };
  
  const timeMultipliers = {
    day: 1,
    week: 7,
    month: 30,
    year: 365
  };
  
  // Realistic impact thresholds (in kg)
  const impactThresholds = {
    marineLife: {
      low: 1,
      moderate: 5,
      high: 10,
      severe: 20
    },
    carbon: {
      low: 2,
      moderate: 10,
      high: 20,
      severe: 40
    },
    landfill: {
      low: 0.5,
      moderate: 2,
      high: 5,
      severe: 10
    }
  };
  
  // Initialize progress bars
  useEffect(() => {
    if (!results) return;

    const initializeProgressBars = async () => {
      try {
        // Dynamically import the progressbar.js library
        const ProgressBar = await import('progressbar.js');
        
        const initProgressBar = (container, value) => {
          return new ProgressBar.Line(container, {
            strokeWidth: 4,
            easing: 'easeInOut',
            duration: 1400,
            color: '#f9b115',
            trailColor: '#eee',
            trailWidth: 1,
            svgStyle: { width: '100%', height: '100%' },
            from: { color: '#1b9e3e' },
            to: { color: '#e55353' },
            step: (state, bar) => {
              bar.path.setAttribute('stroke', state.color);
            }
          });
        };

        // Initialize progress bars if they don't exist
        if (!marineProgress.current && marineBarRef.current) {
          marineProgress.current = initProgressBar(marineBarRef.current, results.marineLifeRisk);
        }
        if (!carbonProgress.current && carbonBarRef.current) {
          carbonProgress.current = initProgressBar(carbonBarRef.current, results.carbonFootprint);
        }
        if (!landfillProgress.current && landfillBarRef.current) {
          landfillProgress.current = initProgressBar(landfillBarRef.current, results.landfillSpace);
        }

        // Animate progress bars
        if (marineProgress.current) {
          marineProgress.current.animate(results.marineLifeRisk / 100);
        }
        if (carbonProgress.current) {
          carbonProgress.current.animate(results.carbonFootprint / 100);
        }
        if (landfillProgress.current) {
          landfillProgress.current.animate(results.landfillSpace / 100);
        }
      } catch (error) {
        console.error('Failed to load progressbar.js:', error);
      }
    };

    initializeProgressBars();

    // Cleanup function
    return () => {
      [marineProgress, carbonProgress, landfillProgress].forEach(progress => {
        if (progress.current) {
          progress.current.destroy();
          progress.current = null;
        }
      });
    };
  }, [results]);

  // Rest of the component remains the same...
  const calculatePlastic = () => {
    setLoading(true);
    
    setTimeout(() => {
      const multiplier = timeMultipliers[timeframe];
      
      const totalGrams = (
        (values.bottles * plasticWeights.bottle) +
        (values.bags * plasticWeights.bag) +
        (values.straws * plasticWeights.straw) +
        (values.packaging * plasticWeights.packaging) +
        (values.containers * plasticWeights.container)
      ) * multiplier;
      
      const totalKg = totalGrams / 1000;
      
      // Calculate environmental impact percentages
      const marineLifeRisk = calculateImpactPercentage(totalKg, impactThresholds.marineLife);
      const carbonFootprint = calculateImpactPercentage(totalKg, impactThresholds.carbon);
      const landfillSpace = calculateImpactPercentage(totalKg, impactThresholds.landfill);
      
      setResults({
        totalGrams,
        totalKg,
        marineLifeRisk,
        carbonFootprint,
        landfillSpace,
        bottles: values.bottles * multiplier,
        bags: values.bags * multiplier,
        straws: values.straws * multiplier,
        packaging: values.packaging * multiplier,
        containers: values.containers * multiplier
      });
      
      setLoading(false);
    }, 1500);
  };
  
  // Fixed impact calculation with realistic thresholds
  const calculateImpactPercentage = (totalKg, thresholds) => {
    if (totalKg <= thresholds.low) return Math.max(25, (totalKg / thresholds.low) * 25);
    if (totalKg <= thresholds.moderate) return Math.max(50, 25 + ((totalKg - thresholds.low) / (thresholds.moderate - thresholds.low)) * 25);
    if (totalKg <= thresholds.high) return Math.max(75, 50 + ((totalKg - thresholds.moderate) / (thresholds.high - thresholds.moderate)) * 25);
    if (totalKg <= thresholds.severe) return Math.max(90, 75 + ((totalKg - thresholds.high) / (thresholds.severe - thresholds.high)) * 15);
    return 100;
  };
  
  const getImpactLevel = (value) => {
    if (value <= 25) return 'Low';
    if (value <= 50) return 'Moderate';
    if (value <= 75) return 'High';
    return 'Severe';
  };
  
  // Fixed color function with proper gradient from green to red
  const getImpactColor = (value) => {
    if (value <= 25) return 'success';
    if (value <= 50) return 'warning';
    if (value <= 75) return 'danger';
    return 'danger';
  };
  
  const handleInputChange = (item, value) => {
    setValues(prev => ({
      ...prev,
      [item]: Math.max(0, parseInt(value) || 0)
    }));
  };
  
  const resetCalculator = () => {
    setValues({
      bottles: 0,
      bags: 0,
      straws: 0,
      packaging: 0,
      containers: 0
    });
    setResults(null);
  };
  
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <CContainer className="py-4">
      <CCard className="mb-4">
        <CCardHeader className="bg-primary text-white">
          <h2 className="mb-0 d-flex align-items-center">
            Plastic Pollution Calculator
          </h2>
          <p className="mb-0 mt-2">
            Calculate your plastic footprint and learn how to reduce it
          </p>
        </CCardHeader>
        
        {!results ? (
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>Your Plastic Consumption</h4>
              <CFormSelect 
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="day">Per Day</option>
                <option value="week">Per Week</option>
                <option value="month">Per Month</option>
                <option value="year">Per Year</option>
              </CFormSelect>
            </div>
            
            <div className="plastic-inputs mb-4">
              <CRow className="mb-3">
                <CCol md={8} className="d-flex align-items-center">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                    <span>💧</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Plastic Bottles</h5>
                    <small className="text-muted">Water, soda, juice bottles</small>
                  </div>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min="0"
                    value={values.bottles}
                    onChange={(e) => handleInputChange('bottles', e.target.value)}
                  />
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol md={8} className="d-flex align-items-center">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                    <span>🛍️</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Plastic Bags</h5>
                    <small className="text-muted">Grocery, shopping, produce bags</small>
                  </div>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min="0"
                    value={values.bags}
                    onChange={(e) => handleInputChange('bags', e.target.value)}
                  />
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol md={8} className="d-flex align-items-center">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                    <span>🥤</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Plastic Straws</h5>
                    <small className="text-muted">Drink straws, stirrers</small>
                  </div>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min="0"
                    value={values.straws}
                    onChange={(e) => handleInputChange('straws', e.target.value)}
                  />
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol md={8} className="d-flex align-items-center">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                    <span>📦</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Plastic Packaging</h5>
                    <small className="text-muted">Food wrappers, snack bags</small>
                  </div>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min="0"
                    value={values.packaging}
                    onChange={(e) => handleInputChange('packaging', e.target.value)}
                  />
                </CCol>
              </CRow>
              
              <CRow className="mb-3">
                <CCol md={8} className="d-flex align-items-center">
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '36px', height: '36px' }}>
                    <span>🍱</span>
                  </div>
                  <div>
                    <h5 className="mb-0">Takeout Containers</h5>
                    <small className="text-muted">Food containers, cups, lids</small>
                  </div>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="number"
                    min="0"
                    value={values.containers}
                    onChange={(e) => handleInputChange('containers', e.target.value)}
                  />
                </CCol>
              </CRow>
            </div>
            
            <div className="d-grid">
              <CButton 
                color="primary" 
                size="lg"
                onClick={calculatePlastic}
                disabled={loading || Object.values(values).every(v => v === 0)}
              >
                {loading ? (
                  <>
                    <CSpinner size="sm" /> Calculating...
                  </>
                ) : 'Calculate My Plastic Footprint'}
              </CButton>
            </div>
            
            <div className="mt-4 p-4 bg-body-secondary border-start border-primary border-4 rounded">
              <h5 className="text-primary d-flex align-items-center">
                💡 Did You Know?
              </h5>
              <ul className="mt-3">
                <li className="mb-2">Humans buy about 1,000,000 plastic bottles per minute</li>
                <li className="mb-2">Less than 10% of all plastic ever produced has been recycled</li>
                <li className="mb-2">Plastic takes 400+ years to degrade in the environment</li>
                <li>100,000 marine animals die from plastic entanglement annually</li>
              </ul>
            </div>
          </CCardBody>
        ) : (
          <CCardBody>
            <div className="text-center mb-4">
              <h2 className="text-primary">
                Your Plastic Footprint: {formatNumber(results.totalKg.toFixed(1))} kg
              </h2>
              <p className="text-medium-emphasis">
                That's {formatNumber(results.totalGrams.toFixed(0))} grams of plastic waste every {timeframe}
              </p>
              
              <div className="d-flex justify-content-center gap-2 mb-4">
                <CButton color="primary" onClick={resetCalculator}>
                  Calculate Again
                </CButton>
                <CButton color="success" variant="outline">
                  <CIcon icon={cilRecycle} className="me-1" /> 
                  Reduction Tips
                </CButton>
              </div>
            </div>
            
            <div className="mb-5">
              <h4 className="mb-3 d-flex align-items-center">
                <CIcon icon={cilChart} className="me-2 text-info" />
                Environmental Impact
              </h4>
              
              <div className="impact-item mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <h5>Marine Life Threat</h5>
                  <span className={`text-${getImpactColor(results.marineLifeRisk)} fw-bold`}>
                    {getImpactLevel(results.marineLifeRisk)}
                  </span>
                </div>
                <div 
                  ref={marineBarRef} 
                  style={{ height: '20px', marginBottom: '1rem' }}
                />
                <p className="text-medium-emphasis small">
                  Plastic kills over 1 million marine animals annually. Your consumption could impact 
                  approximately {(results.totalKg * 0.1).toFixed(1)} marine organisms.
                </p>
              </div>
              
              <div className="impact-item mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <h5>Carbon Footprint</h5>
                  <span className={`text-${getImpactColor(results.carbonFootprint)} fw-bold`}>
                    {getImpactLevel(results.carbonFootprint)}
                  </span>
                </div>
                <div 
                  ref={carbonBarRef} 
                  style={{ height: '20px', marginBottom: '1rem' }}
                />
                <p className="text-medium-emphasis small">
                  Plastic production emits ~2kg CO₂ per kg of plastic. Your footprint equals {(results.totalKg * 2).toFixed(1)} kg of CO₂ emissions.
                </p>
              </div>
              
              <div className="impact-item mb-4">
                <div className="d-flex justify-content-between mb-2">
                  <h5>Landfill Contribution</h5>
                  <span className={`text-${getImpactColor(results.landfillSpace)} fw-bold`}>
                    {getImpactLevel(results.landfillSpace)}
                  </span>
                </div>
                <div 
                  ref={landfillBarRef} 
                  style={{ height: '20px', marginBottom: '1rem' }}
                />
                <p className="text-medium-emphasis small">
                  Plastic occupies 25% of landfill space. Your waste would fill approximately {(results.totalKg * 0.03).toFixed(1)} cubic meters of landfill space.
                </p>
              </div>
            </div>
            
            <div className="mb-5">
              <h4 className="mb-3">Your Plastic Consumption Breakdown</h4>
              <CRow>
                <CCol md={6}>
                  <CListGroup>
                    <CListGroupItem className="d-flex justify-content-between align-items-center">
                      Bottles
                      <span className="badge bg-primary rounded-pill">
                        {formatNumber(results.bottles)}
                      </span>
                    </CListGroupItem>
                    <CListGroupItem className="d-flex justify-content-between align-items-center">
                      Bags
                      <span className="badge bg-primary rounded-pill">
                        {formatNumber(results.bags)}
                      </span>
                    </CListGroupItem>
                    <CListGroupItem className="d-flex justify-content-between align-items-center">
                      Straws
                      <span className="badge bg-primary rounded-pill">
                        {formatNumber(results.straws)}
                      </span>
                    </CListGroupItem>
                  </CListGroup>
                </CCol>
                <CCol md={6}>
                  <CListGroup>
                    <CListGroupItem className="d-flex justify-content-between align-items-center">
                      Packaging
                      <span className="badge bg-primary rounded-pill">
                        {formatNumber(results.packaging)}
                      </span>
                    </CListGroupItem>
                    <CListGroupItem className="d-flex justify-content-between align-items-center">
                      Containers
                      <span className="badge bg-primary rounded-pill">
                        {formatNumber(results.containers)}
                      </span>
                    </CListGroupItem>
                    <CListGroupItem className="d-flex justify-content-between align-items-center fw-bold">
                      Total Items
                      <span className="badge bg-dark rounded-pill">
                        {formatNumber(
                          results.bottles + 
                          results.bags + 
                          results.straws + 
                          results.packaging + 
                          results.containers
                        )}
                      </span>
                    </CListGroupItem>
                  </CListGroup>
                </CCol>
              </CRow>
            </div>
            
            <div className="reduction-tips p-4 bg-body-secondary border-start border-primary border-4 rounded">
              <h4 className="mb-3 d-flex align-items-center text-primary">
                <CIcon icon={cilRecycle} className="me-2 text-success" />
                Reduce Your Plastic Footprint
              </h4>
              <CRow>
                <CCol md={4} className="mb-3">
                  <div className="bg-body-tertiary p-3 rounded shadow-sm h-100">
                    <h5 className="text-primary">🚰 Use Reusables</h5>
                    <p className="mb-0">
                      Carry a reusable water bottle, coffee cup, and shopping bags. 
                      Could save {Math.floor(results.bottles/4)} bottles and {Math.floor(results.bags/3)} bags monthly.
                    </p>
                  </div>
                </CCol>
                <CCol md={4} className="mb-3">
                  <div className="bg-body-tertiary p-3 rounded shadow-sm h-100">
                    <h5 className="text-primary">🥡 Avoid Single-Use</h5>
                    <p className="mb-0">
                      Refuse straws, plastic utensils, and takeout containers. 
                      Could save {Math.floor(results.straws/2)} straws and {Math.floor(results.containers/3)} containers weekly.
                    </p>
                  </div>
                </CCol>
                <CCol md={4} className="mb-3">
                  <div className="bg-body-tertiary p-3 rounded shadow-sm h-100">
                    <h5 className="text-primary">♻️ Recycle Properly</h5>
                    <p className="mb-0">
                      Learn your local recycling rules. Proper recycling could divert 
                      up to {(results.totalKg * 0.3).toFixed(1)}kg of plastic from landfills.
                    </p>
                  </div>
                </CCol>
              </CRow>
              <div className="text-center mt-3">
                <CButton color="success">
                  Get Your Personalized Reduction Plan
                </CButton>
              </div>
            </div>
          </CCardBody>
        )}
      </CCard>
      
      <CRow>
        <CCol md={6} className="mb-4">
          <CCard className="h-100">
            <CCardHeader className="bg-info text-white">
              <h5>Plastic Impact Worldwide</h5>
            </CCardHeader>
            <CCardBody>
              <ul>
                <li>8 million tons of plastic enter oceans annually</li>
                <li>50% of plastic is single-use</li>
                <li>Plastic production has increased 200x since 1950</li>
                <li>By 2050, plastic could outweigh fish in the ocean</li>
                <li>90% of seabirds have plastic in their stomachs</li>
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6} className="mb-4">
          <CCard className="h-100">
            <CCardHeader className="bg-success text-white">
              <h5>Benefits of Reduction</h5>
            </CCardHeader>
            <CCardBody>
              <ul>
                <li>Reduces ocean pollution and marine deaths</li>
                <li>Lowers carbon emissions by up to 70%</li>
                <li>Conserves fossil fuel resources</li>
                <li>Saves money - reusable items pay for themselves</li>
                <li>Creates demand for sustainable alternatives</li>
              </ul>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Plastics;
