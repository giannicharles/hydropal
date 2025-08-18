import React, { useState, useEffect } from 'react'; // Added useState and useEffect
import classNames from 'classnames'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner // Added spinner import
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
  cilPeople,
} from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import api from '../../services/Api';

const Dashboard = () => {
  const [todayWater, setTodayWater] = useState(0);
  const [ranking, setRanking] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const DAILY_GOAL_ML = 2500;

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch today's water
        const todayRes = await api.get('/api/auth/water/today');
        setTodayWater(todayRes.data.total);
        
        // Fetch ranking
        const rankingRes = await api.get('/api/auth/water/ranking');
        setRanking(rankingRes.data.data);
        
        // Fetch monthly data
        const monthlyRes = await api.get('/api/auth/water/monthly');
        setMonthlyData(monthlyRes.data.data);
      } catch (error) {
        console.error('Dashboard data error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const progressExample = [
    { 
      title: 'My Intake', 
      value: `${(todayWater / 29.5735).toFixed(1)} oz`, 
      percent: Math.min((todayWater / DAILY_GOAL_ML) * 100, 100), 
      color: 'info' 
    },
    { 
      title: 'Daily Goal', 
      value: `${(DAILY_GOAL_ML / 29.5735).toFixed(1)} oz`, 
      percent: 100, 
      color: 'success' 
    },
    { title: 'Male Average', value: '124 oz', percent: 82, color: 'danger' },
    { title: 'Female Average', value: '92 oz', percent: 61, color: 'warning' },
    { title: 'Lowest Country Average', value: '65 oz', percent: 43, color: 'secondary' },
  ]

/* 
 * DAILY WATER INTAKE TRACKING COMPONENT
 */

// Get current day of week (0 = Sunday, 1 = Monday, etc.)
const today = new Date().getDay();

// Day of the week variables
let sun, mon, tue, wed, thur, fri, sat;

if (today === 0) { sun = todayWater; }
if (today === 1) { mon = todayWater; }
if (today === 2) { tue = todayWater; }
if (today === 3) { wed = todayWater; }
if (today === 4) { thur = todayWater; }
if (today === 5) { fri = todayWater; }
if (today === 6) { sat = todayWater; }

// Update chart with current values
const progressGroupExample1 = [
  { 
    title: 'Sunday', 
    value1Text: sun ? `${(sun / 29.5735).toFixed(1)} oz` : '0.0 oz',
    value1Percent: sun ? Math.min((sun / DAILY_GOAL_ML) * 100, 100) : 0,
    value2Text: '85.0 oz',
    value2Percent: 100
  },
  { 
    title: 'Monday', 
    value1Text: mon ? `${(mon / 29.5735).toFixed(1)} oz` : '0.0 oz',
    value1Percent: mon ? Math.min((mon / DAILY_GOAL_ML) * 100, 100) : 0,
    value2Text: '85.0 oz',
    value2Percent: 100
  },
  { 
    title: 'Tuesday', 
    value1Text: tue ? `${(tue / 29.5735).toFixed(1)} oz` : '0.0 oz',
    value1Percent: tue ? Math.min((tue / DAILY_GOAL_ML) * 100, 100) : 0,
    value2Text: '85.0 oz',
    value2Percent: 100
  },
  { 
    title: 'Wednesday', 
    value1Text: wed ? `${(wed / 29.5735).toFixed(1)} oz` : '0.0 oz',
    value1Percent: wed ? Math.min((wed / DAILY_GOAL_ML) * 100, 100) : 0,
    value2Text: '85.0 oz',
    value2Percent: 100
  },
  { 
    title: 'Thursday', 
    value1Text: thur ? `${(thur / 29.5735).toFixed(1)} oz` : '0.0 oz',
    value1Percent: thur ? Math.min((thur / DAILY_GOAL_ML) * 100, 100) : 0,
    value2Text: '85.0 oz',
    value2Percent: 100
  },
  { 
    title: 'Friday', 
    value1Text: fri ? `${(fri / 29.5735).toFixed(1)} oz` : '0.0 oz',
    value1Percent: fri ? Math.min((fri / DAILY_GOAL_ML) * 100, 100) : 0,
    value2Text: '85.0 oz',
    value2Percent: 100
  },
  { 
    title: 'Saturday', 
    value1Text: sat ? `${(sat / 29.5735).toFixed(1)} oz` : '0.0 oz',
    value1Percent: sat ? Math.min((sat / DAILY_GOAL_ML) * 100, 100) : 0,
    value2Text: '85.0 oz',
    value2Percent: 100
  },
];

  // Avatar selection based on ranking position
  const getAvatarForRank = (index) => {
    const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];
    return avatars[index % avatars.length];
  };

  // Status color based on ranking position
  const getStatusForRank = (index) => {
    if (index === 0) return 'success';
    if (index === 1) return 'info';
    if (index === 2) return 'warning';
    return 'secondary';
  };

  // Format ranking data for table
  const tableExample = ranking.map((user, index) => ({
    avatar: { 
      src: getAvatarForRank(index),
      status: getStatusForRank(index)
    },
    user: {
      name: user.name,
      rank: index + 1
    },
    usage: {
      value: Math.round((user.totalAmount / DAILY_GOAL_ML) * 100),
      color: index === 0 ? 'success' : index === 1 ? 'info' : index === 2 ? 'warning' : 'secondary'
    }
  }));

  // Loading state
  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <CSpinner color="primary" />
      </div>
    );
  }

  return (
    <>
      <WidgetsDropdown className="mb-4" />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                My Hydration Journey
              </h4>
              <div className="small text-body-secondary">Monthly Average in Ounces</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
            </CCol>
          </CRow>
          <MainChart monthlyData={monthlyData} />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
      <WidgetsBrand className="mb-4" withCharts />
      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Daily Hydration Progress</CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs>
                  <CRow>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-body-secondary text-truncate small">My Intake</div>
                        <div className="fs-5 fw-semibold">{(todayWater / 29.5735).toFixed(1)} oz</div>
                      </div>
                    </CCol>
                    <CCol xs={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-body-secondary text-truncate small">
                          Daily Goal
                        </div>
                        <div className="fs-5 fw-semibold">{(DAILY_GOAL_ML / 29.5735).toFixed(1)} oz</div>
                      </div>
                    </CCol>
                  </CRow>
                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-body-secondary small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1Percent} />
                        <CProgress thin color="success" value={item.value2Percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead className="text-nowrap">
                  <CTableRow>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">User</CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary text-center">
                      Rank
                    </CTableHeaderCell>
                    <CTableHeaderCell className="bg-body-tertiary">Daily Progress</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="md" src={item.avatar.src} status={item.avatar.status} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="fw-bold">#{item.user.rank}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex justify-content-between text-nowrap">
                          <div className="fw-semibold">{item.usage.value}%</div>
                          <div>{(DAILY_GOAL_ML * item.usage.value / 100 / 29.5735).toFixed(1)} oz</div>
                        </div>
                        <CProgress thin color={item.usage.color} value={item.usage.value} />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
