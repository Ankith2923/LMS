import { useState, useEffect } from 'react';
import { BookOpen, User, PlayCircle, CheckCircle } from 'lucide-react';
import api from '../api';
import './Dashboard.css'; // Reusing dashboard styles for grid

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [myCourseIds, setMyCourseIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [allCoursesRes, myCoursesRes] = await Promise.all([
          api.get('/courses'),
          api.get('/courses/my-courses')
        ]);
        
        setCourses(allCoursesRes.data);
        const enrolledIds = new Set(myCoursesRes.data.map(c => c.id));
        setMyCourseIds(enrolledIds);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await api.post(`/courses/${courseId}/enroll`);
      setMyCourseIds(prev => new Set(prev).add(courseId));
    } catch (err) {
      console.error("Failed to enroll:", err);
    }
  };

  if (loading) {
    return <div className="page-wrapper animate-fade-in"><div className="container"><h2>Loading courses...</h2></div></div>;
  }

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    course.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-wrapper dashboard-page animate-fade-in">
      <div className="container">
        <div className="dashboard-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
          <div>
            <h1 className="dashboard-title">Browse Courses</h1>
            <p className="dashboard-subtitle">Discover new topics and expand your skillset.</p>
          </div>
          <div style={{flex: '1', minWidth: '250px', maxWidth: '400px'}}>
            <input 
              type="text" 
              placeholder="Search courses or instructors..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div className="courses-grid" style={{marginTop: '2rem'}}>
          {filteredCourses.map(course => {
            const isEnrolled = myCourseIds.has(course.id);
            return (
              <div key={course.id} className="course-card glass-card">
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor"><User size={14} style={{display:'inline', marginRight:'4px'}}/> by {course.instructorName}</p>
                  <p className="course-description" style={{marginTop: '0.5rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem'}}>
                    {course.description}
                  </p>
                  <div className="course-actions" style={{marginTop: '1.5rem'}}>
                    {isEnrolled ? (
                      <button className="btn btn-outline" style={{width: '100%', borderColor: '#10b981', color: '#10b981'}} disabled>
                        <CheckCircle size={16} /> Enrolled
                      </button>
                    ) : (
                      <button className="btn btn-primary" style={{width: '100%'}} onClick={() => handleEnroll(course.id)}>
                        <PlayCircle size={16} /> Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Courses;
