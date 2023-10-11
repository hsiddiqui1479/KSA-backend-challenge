interface Task {
  id: string;
  title: string;
  description: string;
  creationDate: Date;
  dueDate: Date;
  assignedTo: string | null;
  category: string;
  status: 'Pending' | 'Completed';
}

export default Task;
