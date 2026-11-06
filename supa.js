// Define your Supabase credentials here
const SUPABASE_URL ="https://yiijyfwleunmnekjydtq.supabase.co/rest/v1/attendance";
const SUPABASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaWp5ZndsZXVubW5la2p5ZHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NTk2NDYsImV4cCI6MjEwOTMzNTY0Nn0.aHRI3OtMuwjlhyKj6Mjr-QuO8qXFDVdYg1PRXiLmGRU";

// Initialize the Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Define AngularJS Module and Controller
angular.module('attendanceApp', [])
.controller('AttendanceController', ['$scope', function($scope) {
    
    // Model for new student form
    $scope.newStudent = {
        name: '',
        department: ''
    };

    // Model for marking attendance
    $scope.attendanceData = {
        session_id: 1, 
        student_id: 1, 
        status: 'P'    
    };

    // Function to save a new student to Supabase
    $scope.saveStudent = async function() {
        try {
            const { data, error } = await supabase
                .from('students')
                .insert([
                    { 
                        name: $scope.newStudent.name, 
                        department: $scope.newStudent.department 
                    }
                ]);

            if (error) throw error;

            alert('Student saved successfully to Supabase!');
            
            // Clear form and update view using $scope.$apply
            $scope.$apply(() => {
                $scope.newStudent.name = '';
                $scope.newStudent.department = '';
            });
        } catch (err) {
            console.error('Error saving student:', err.message);
            alert('Failed to save student: ' + err.message);
        }
    };

    // Function to save an attendance record to Supabase
    $scope.saveAttendance = async function() {
        try {
            const { data, error } = await supabase
                .from('attendance_records')
                .insert([
                    { 
                        session_id: $scope.attendanceData.session_id, 
                        student_id: $scope.attendanceData.student_id, 
                        status: $scope.attendanceData.status 
                    }
                ]);

            if (error) throw error;

            alert('Attendance record saved successfully to Supabase!');
        } catch (err) {
            console.error('Error saving attendance:', err.message);
            alert('Failed to save attendance: ' + err.message);
        }
    };

}]);