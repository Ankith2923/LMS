import { useState, useEffect } from 'react';
import { BookOpen, Clock, Award, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Dashboard.css';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await api.get('/courses/my-courses');
        setCourses(response.data);
      } catch (err) {
        console.error("Failed to fetch my courses:", err);
        if (err.response && err.response.status === 403) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, [navigate]);

  const stats = [
    { label: 'Enrolled Courses', value: courses.length.toString(), icon: BookOpen, color: '#3b82f6' },
    { label: 'Completed', value: '0', icon: Award, color: '#10b981' }, // Dummy
    { label: 'Hours Spent', value: '0h', icon: Clock, color: '#8b5cf6' }, // Dummy
  ];

  if (loading) {
    return <div className="page-wrapper animate-fade-in"><div className="container"><h2>Loading dashboard...</h2></div></div>;
  }

  return (
    <div className="page-wrapper dashboard-page animate-fade-in">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Welcome back, Student!</h1>
            <p className="dashboard-subtitle">Here is what's happening with your learning today.</p>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="stat-card glass-card">
                <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="section-title">Continue Learning</h2>
        
        {courses.length === 0 ? (
          <div className="glass-card" style={{padding: '2rem', textAlign: 'center'}}>
            <p style={{marginBottom: '1rem'}}>You haven't enrolled in any courses yet.</p>
            <button className="btn btn-primary" onClick={() => navigate('/courses')}>Browse Courses</button>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map(course => (
              <div key={course.id} className="course-card glass-card">
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">by {course.instructorName}</p>
                  
                  <div className="course-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `0%` }}></div>
                    </div>
                    <span className="progress-text">0% Complete</span>
                  </div>

                  <div className="course-actions">
                    <button className="btn btn-primary">
                      <PlayCircle size={16} /> Continue
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
