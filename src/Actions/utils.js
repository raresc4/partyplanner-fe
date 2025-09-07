export function getHeader() {
  const username = process.env.REACT_APP_USERNAME;
  const password = process.env.REACT_APP_PASSWORD;

  return {
    "Content-Type": "application/json",
    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
  };
}

export function reducer(state, action) {
  switch (action.type) {
    case "updateTasks": {
      return action.payload;
    }
    case "increment": {
      return state.map((task, index) => {
        if (index === action.index) {
          if (task.counter + 1 == 100) {
            return { ...task, counter: 99 };
          } else {
            return { ...task, counter: task.counter + 1 };
          }
        } else {
          return task;
        }
      });
    }
    case "decrement": {
      return state.map((task, index) => {
        if (index === action.index) {
          if (task.counter - 1 < 0) {
            return { ...task, counter: 0 };
          } else {
            return { ...task, counter: task.counter - 1 };
          }
        } else {
          return task;
        }
      });
    }
    default: {
      return state;
    }
  }
}

export function getMonth(date) {
  switch (date.substring(3, 5)) {
    case "01":
      return "JAN";
    case "02":
      return "FEB";
    case "03":
      return "MAR";
    case "04":
      return "APR";
    case "05":
      return "MAY";
    case "06":
      return "JUN";
    case "07":
      return "JUL";
    case "08":
      return "AUG";
    case "09":
      return "SEP";
    case "10":
      return "OCT";
    case "11":
      return "NOV";
    case "12":
      return "DEC";
    default:
      return "JAN";
  }
}
