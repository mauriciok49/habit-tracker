document.addEventListener('DOMContentLoaded', () => {
  const habits = document.querySelectorAll('.IndividualsHabits');

  habits.forEach(habit => {
    const calendar = habit.querySelector('.HabitCalendar');

    if (!calendar) return; // evita erro se não tiver calendar

    const totalDays = 31; // ou quantos dias quiser
    for (let i = 0; i < totalDays; i++) {
      const day = document.createElement('div');
      day.classList.add('day');

      // Marca alguns dias aleatoriamente como concluídos
      if (Math.random() > 0.5) {
        day.classList.add('completed');
      }

      calendar.appendChild(day);
    }
  });
});
