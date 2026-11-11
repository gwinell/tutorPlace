INSERT OR IGNORE INTO courses (id,title,description,position) SELECT 'python-course','Python','От первой программы до самостоятельных проектов. Теория, примеры и проектные инструкции собраны по темам; задания назначаются отдельно в codeTogether. Относительные ссылки на изображения и файлы разрешаются относительно исходного материала.', COALESCE(MAX(position),-1)+1 FROM courses;
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('python-basics','python-course',NULL,'Первые шаги и основы Python','','','md',NULL,NULL,0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('loops','python-course',NULL,'Циклы и алгоритмы','','','md',NULL,NULL,1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('collections-and-text','python-course',NULL,'Коллекции и текст','','','md',NULL,NULL,2);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('functions-and-modules','python-course',NULL,'Функции и модули','','','md',NULL,NULL,3);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('object-oriented-programming','python-course',NULL,'Объектно-ориентированное программирование','','','md',NULL,NULL,4);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('errors-and-debugging','python-course',NULL,'Ошибки и отладка','','','md',NULL,NULL,5);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('files-and-data','python-course',NULL,'Файлы и данные','','','md',NULL,NULL,6);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('project-environment','python-course',NULL,'Структура проекта и инструменты','','','md',NULL,NULL,7);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('testing-and-quality','python-course',NULL,'Тестирование и качество кода','','','md',NULL,NULL,8);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('projects','python-course',NULL,'Проекты Python','','','md',NULL,NULL,9);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('graphics-and-games','python-course',NULL,'Графика и игры','','','md',NULL,NULL,10);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('additional-practice','python-course',NULL,'Дополнительные материалы и практика','','','md',NULL,NULL,11);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('notebooks-start','python-course','python-basics','Как работать с блокнотами','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/00_start/README.md',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('text-input-output','python-course','python-basics','Текст, ввод и вывод','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/01_basics/01_first_lesson/01_text_input_output.ipynb',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('numbers-and-conditions','python-course','python-basics','Числа и условия','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/01_basics/02_numbers_and_conditions/02_numbers_and_conditions.ipynb',2);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('truthiness-and-conditions','python-course','python-basics','Истинность значений и логические операции','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/01_basics/03_truthiness/lesson_truthiness_and_conditions.ipynb',3);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('python-quick-reference','python-course','python-basics','Краткий конспект Python','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/01_basics/konpekt_python.md',4);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('for-step-by-step','python-course','loops','Цикл for по шагам','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/02_loops/01_for/03_for_loop_step_by_step.ipynb',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('for-practice','python-course','loops','Дополнительная практика с for','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/02_loops/01_for/for_loop_theory_and_tasks.ipynb',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('while-and-random','python-course','loops','Цикл while и случайные значения','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/02_loops/02_while/04_while_and_random.ipynb',2);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('while-practice','python-course','loops','Дополнительная практика с while','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/02_loops/02_while/while-tasks.md',3);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('nested-loops','python-course','loops','Вложенные циклы','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/02_loops/03_nested_loops/lesson_nested_loops.ipynb',4);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('algorithm-design','python-course','loops','Практикумы по составлению алгоритмов','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/02_loops/03_nested_loops/algorithm_design_workshops.md',5);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('lists','python-course','collections-and-text','Списки','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/01_lists/lesson_05_lists.ipynb',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('lists-in-loops','python-course','collections-and-text','Списки в циклах и включения','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/01_lists/lesson_06_lists_loops_comprehensions.ipynb',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('string-methods','python-course','collections-and-text','Методы строк','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/02_strings/lesson_strings_methods.ipynb',2);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('tuples-dicts-sets','python-course','collections-and-text','Кортежи, словари и множества','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/03_tuples_dicts_sets/lesson_tuples_dicts_sets.ipynb',3);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('records-practice','python-course','collections-and-text','Практикум по составным записям','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/03_tuples_dicts_sets/lesson_records_practice.ipynb',4);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('iterators-generators','python-course','collections-and-text','Итераторы и генераторы','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/04_iterators/lesson_iterators_generators.ipynb',5);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('text-bytes-utf8','python-course','collections-and-text','Текст, байты и UTF-8','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/05_text_bytes/lesson_text_bytes.ipynb',6);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('functions-modules','python-course','functions-and-modules','Функции и модули','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/04_functions_modules/lesson_07_functions_and_modules.ipynb',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('function-arguments-scope','python-course','functions-and-modules','Аргументы и область видимости','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/04_functions_modules/lesson_functions_arguments_scope.ipynb',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('sorting-callbacks','python-course','functions-and-modules','Сортировка и функции-ключи','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/04_functions_modules/lesson_sorting_and_callbacks.ipynb',2);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('oop-basics','python-course','object-oriented-programming','Классы и объекты','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/05_oop/lesson_08_oop_basics.ipynb',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('oop-composition-inheritance','python-course','object-oriented-programming','Композиция и наследование','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/05_oop/lesson_oop_composition_representation_inheritance.ipynb',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('errors-debugging','python-course','errors-and-debugging','Обработка ошибок и отладка','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/06_errors_debugging/lesson_errors_debugging.ipynb',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('pdb-debugger','python-course','errors-and-debugging','Пошаговый отладчик pdb','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/06_errors_debugging/lesson_step_debugger.md',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('files-csv-json','python-course','files-and-data','Файлы, CSV и JSON','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/07_files_data/lesson_files_csv_json.ipynb',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('project-structure','python-course','project-environment','Структура проекта и окружение','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/08_project_environment/lesson_project_structure_environment.ipynb',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('command-line-git','python-course','project-environment','Командная строка и Git','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/08_project_environment/CLI_AND_GIT.md',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('testing-quality','python-course','testing-and-quality','Тестирование и качество кода','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/09_testing_quality/lesson_testing_quality.ipynb',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('projects-overview','python-course','projects','Маршрут проектов','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/projects/README.md',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('project-basics','python-course','projects','Проект: основы','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/projects/01_basics.md',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('project-loops-lists','python-course','projects','Проект: циклы и списки','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/projects/02_loops_lists.md',2);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('project-strings-functions','python-course','projects','Проект: строки и функции','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/projects/03_strings_functions.md',3);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('project-dictionaries','python-course','projects','Проект: словари','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/projects/04_dictionaries.md',4);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('project-oop','python-course','projects','Проект: ООП','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/projects/05_oop.md',5);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('project-files','python-course','projects','Проект: файлы','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/projects/06_files.md',6);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('turtle','python-course','graphics-and-games','Графика Turtle','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_turtle/%D1%87%D0%B5%D1%80%D0%B5%D0%BF%D0%B0%D1%88%D0%BA%D0%B0_%D0%B8_%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D1%8B_Python_5_%D0%BA%D0%BB%D0%B0%D1%81%D1%81.md',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('dinosaur-game','python-course','graphics-and-games','Проект «Динозаврик»','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/04_pygame/01_dinosaur/dinosaur_game_explanation.md',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('chess-game','python-course','graphics-and-games','Проект «Шахматы»','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/04_pygame/02_chess/chess_guide.md',2);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('chess-pieces','python-course','graphics-and-games','Фигуры и правила шахмат','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/04_pygame/02_chess/pieces_guide.md',3);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('doodle-jump','python-course','graphics-and-games','Проект Doodle Jump','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/04_pygame/03_doodle_jump/README.md',4);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('special-overview','python-course','additional-practice','Обзор дополнительных материалов','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/special/README.md',0);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('variables-print-input','python-course','additional-practice','Переменные, print и input','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/special/variables_print_input.ipynb',1);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('conditions-bool-if','python-course','additional-practice','Условия и логические значения','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/special/conditions_bool_if.ipynb',2);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('while-loop-conditions','python-course','additional-practice','while и условия','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/special/while_loop_and_conditions.ipynb',3);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('while-advanced-practice','python-course','additional-practice','Дополнительная практика while','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/special/while_advanced_practice.ipynb',4);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('while-break-continue-range','python-course','additional-practice','break, continue и range','','','ipynb',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/special/while_break_continue_for_range.ipynb',5);
--> statement-breakpoint
INSERT OR IGNORE INTO topics (id,course_id,parent_topic_id,title,description,content,format,colab_url,github_url,position) VALUES ('mixed-lessons','python-course','additional-practice','Смешанные уроки','','','md',NULL,'https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/00_mixed_lessons/lesson.md',6);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9d28301184e99d2f','text-input-output',NULL,NULL,'Выведи название любимой книги или игры в кавычках.','code','**Задача.** Выведи название любимой книги или игры в кавычках. Пока не добавляй к ответу поясняющий текст.

**Ожидаемый результат.** В выводе показано выбранное название книги или игры в кавычках, без поясняющего текста.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f962626e1fe4ea48','text-input-output',NULL,NULL,'Одной командой print() выведи имя и любимый цвет через запятую.','code','**Задача.** Одной командой `print()` выведи имя и любимый цвет через запятую. Между ними должен появиться пробел.

**Ожидаемый результат.** Одна команда `print()` выводит имя и цвет в этом порядке, разделённые запятой и одним пробелом.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b5e7aa1926889d68','text-input-output',NULL,NULL,'Создай переменную pet_name и сохрани в ней имя животного или вымышленного персонажа.','code','**Задача.** Создай переменную `pet_name` и сохрани в ней имя животного или вымышленного персонажа.

**Ожидаемый результат.** После выполнения `pet_name` содержит выбранное имя животного или вымышленного персонажа.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-525cb5793df3b1f3','text-input-output',NULL,NULL,'Переменная любимого предмета','code','**Задача.** Создай переменную с понятным именем для любимого предмета и выведи имя ученика вместе с названием предмета.

**Ожидаемый результат.** В выводе показаны имя ученика и название предмета, сохранённое в созданной переменной.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-06a4fc2d849408f0','text-input-output',NULL,NULL,'Попробуй назвать переменную my name.','code','**Задача.** Попробуй назвать переменную `my name`. Исправь имя так, чтобы программа запустилась.

**Ожидаемый результат.** После исправления имени переменной программа запускается без ошибки из-за пробела в идентификаторе.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-25db98fbd4fd4376','text-input-output',NULL,NULL,'Спроси у пользователя название любимой книги или игры.','code','**Задача.** Спроси у пользователя название любимой книги или игры. Сохрани ответ в переменную с подходящим именем, а затем покажи его командой `print()`.

**Ожидаемый результат.** Введённое название сохранено в переменной и затем показано командой `print()`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0a527d306edd6de6','text-input-output',NULL,NULL,'Имя и фамилия','code','**Задача.** Соедини имя и фамилию в одну строку так, чтобы между ними был пробел.

**Ожидаемый результат.** Получена одна строка: имя, один пробел, фамилия.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-78499149f296aa68','text-input-output',NULL,NULL,'Выведи слово Python два раза подряд.','code','**Задача.** Выведи слово `Python` два раза подряд.

**Ожидаемый результат.** В выводе подряд, без разделителя, стоят две копии слова `Python`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4259493d73457dbe','text-input-output',NULL,NULL,'Нарисуй строкой рамку из 12 знаков =.','code','**Задача.** Нарисуй строкой рамку из 12 знаков `=`.

**Ожидаемый результат.** В одной строке ровно 12 знаков `=`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c7f21e9f9c2b48dc','text-input-output',NULL,NULL,'Спроси имя с помощью input(), сохрани его в name, а затем одной f-строкой напиши приветствие с этим именем.','code','**Задача.** Спроси имя с помощью `input()`, сохрани его в `name`, а затем одной f-строкой напиши приветствие с этим именем.

**Ожидаемый результат.** После ввода имя подставлено в приветствие с помощью одной f-строки.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5929eb0d72fb3be8','text-input-output',NULL,NULL,'Выведи три слова через звёздочку с помощью sep.','code','**Задача.** Выведи три слова через звёздочку с помощью `sep`. Затем двумя командами `print()` выведи фразу в одной строке, используя `end`.

**Ожидаемый результат.** Первая часть выводит три слова через `*`; два вызова `print()` второй части продолжают вывод на одной строке благодаря `end`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ed87c669ada2ed85','text-input-output',NULL,NULL,'Выведи два пункта списка на разных строках с помощью \n.','code','**Задача.** Выведи два пункта списка на разных строках с помощью `\n`.

**Ожидаемый результат.** В выводе два пункта списка расположены на разных строках благодаря `\n`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2cdd92d6d5e4660e','text-input-output',NULL,NULL,'Выведи подписи Имя: и Класс: с отступами \t.','code','**Задача.** Выведи подписи `Имя:` и `Класс:` с отступами `\t`.

**Ожидаемый результат.** В выводе есть подписи `Имя:` и `Класс:` с табуляцией `\t` в заданных местах.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c1903cd75914beeb','text-input-output',NULL,NULL,'Покажи в выводе две обратные косые черты.','code','**Задача.** Покажи в выводе две обратные косые черты. Для каждой отображаемой черты в исходном коде нужно написать пару `\\`.

**Ожидаемый результат.** В выводе отображаются две обратные косые черты; для каждой в строковом литерале записана пара `\\`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4edea2d31c43f396','text-input-output',NULL,NULL,'Собери короткую программу-знакомство.','code','**Задача.** Собери короткую программу-знакомство. Она должна спросить имя и увлечение, а потом вывести аккуратную карточку на нескольких строках. Используй только то, что было в этом уроке: `input()`, переменные, f-строки, `print()` и `\n`.

**Подсказка:** сначала получи каждый ответ отдельно, затем составь одну f-строку с помощью `print()`.

**Ожидаемый результат.** После двух вводов появляется карточка на нескольких строках, содержащая имя и увлечение; используются только перечисленные в условии средства.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-91fb88d91bb1432c','text-input-output',NULL,NULL,'Приветствие на борту · обязательная','code','**Сюжет.** Бортовой компьютер встречает нового участника экспедиции.

**Задача.** Получите имя участника и название планеты. Подготовьте приветствие по образцу.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя, затем название планеты. | Одна строка: `Привет, ИМЯ! Добро пожаловать на планету ПЛАНЕТА.` |

**Ожидаемый результат.** Одна строка: `Привет, ИМЯ! Добро пожаловать на планету ПЛАНЕТА.`

**Ограничения.** Каждая строка содержит от 1 до 30 символов; строки непустые. Значения выводятся без изменений.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Лена<br>Марс</pre> | <pre>Привет, Лена! Добро пожаловать на планету Марс.</pre> |
| <pre>Игорь<br>Европа</pre> | <pre>Привет, Игорь! Добро пожаловать на планету Европа.</pre> |

**Пояснение.** Имя и планета подставляются в сообщение; знаки препинания остаются как в образце.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-05b56c8f1454031b','text-input-output',NULL,NULL,'Открытка из путешествия · обязательная','code','**Сюжет.** Путешественник отправляет другу короткую открытку из нового города.

**Задача.** Прочитайте имя получателя и город. Сформируйте открытку ровно из трёх строк.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя получателя, затем город. | Три строки: `Привет, ИМЯ!`, `Пишу тебе из города ГОРОД.`, `До встречи!`. |

**Ожидаемый результат.** Три строки: `Привет, ИМЯ!`, `Пишу тебе из города ГОРОД.`, `До встречи!`.

**Ограничения.** От 1 до 40 символов в каждой строке; пробелы внутри названий разрешены.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Миша<br>Казань</pre> | <pre>Привет, Миша!<br>Пишу тебе из города Казань.<br>До встречи!</pre> |
| <pre>Аня<br>Нижний Новгород</pre> | <pre>Привет, Аня!<br>Пишу тебе из города Нижний Новгород.<br>До встречи!</pre> |

**Пояснение.** Название города может состоять из нескольких слов; вся введённая строка попадает в открытку.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-defd14ead2dff855','text-input-output',NULL,NULL,'Профиль для команды · обязательная','code','**Сюжет.** Участники команды заполняют короткие профили, чтобы познакомиться.

**Задача.** Получите любимый цвет, животное и занятие. Выведите их в порядке ввода с разделителем ` | `.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: цвет, животное, занятие. | Одна строка из трёх ответов. Между соседними ответами — пробел, вертикальная черта и пробел. В начале и конце разделителя нет. |

**Ожидаемый результат.** Одна строка из трёх ответов. Между соседними ответами — пробел, вертикальная черта и пробел. В начале и конце разделителя нет.

**Ограничения.** Каждая строка непустая и содержит не более 50 символов; пробелы внутри разрешены.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>синий<br>кот<br>читать</pre> | <pre>синий &#124; кот &#124; читать</pre> |
| <pre>зелёный<br>морская свинка<br>играть в шахматы</pre> | <pre>зелёный &#124; морская свинка &#124; играть в шахматы</pre> |

**Пояснение.** Каждый ответ сохраняется полностью, в том числе слова внутри занятия.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5bdd9e7987b25126','text-input-output',NULL,NULL,'Билет на поезд · по выбору','code','**Сюжет.** Касса печатает пассажиру простой текстовый билет.

**Задача.** Прочитайте имя пассажира и пункт назначения. Напечатайте билет с заголовком из двенадцати знаков равенства.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя пассажира, затем пункт назначения. | Три строки: `============`, `Пассажир: ИМЯ`, `Куда: ПУНКТ`. Заголовок получите повторением строки. |

**Ожидаемый результат.** Три строки: `============`, `Пассажир: ИМЯ`, `Куда: ПУНКТ`. Заголовок получите повторением строки.

**Ограничения.** Каждая строка содержит от 1 до 50 символов. В обязательной версии нет числового ввода.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Оля<br>Тула</pre> | <pre>============<br>Пассажир: Оля<br>Куда: Тула</pre> |
| <pre>Ян<br>Санкт-Петербург</pre> | <pre>============<br>Пассажир: Ян<br>Куда: Санкт-Петербург</pre> |

**Пояснение.** Заголовок одинаков для всех билетов; остальные две строки зависят от ввода.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0cbf1ce3b7f82e54','text-input-output',NULL,NULL,'Анкета читательского клуба · по выбору','code','**Сюжет.** Клуб хранит сведения об участниках в одинаковых текстовых анкетах.

**Задача.** Получите имя, любимую книгу и любимую игру. Выведите анкету с заданными подписями.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: имя, название книги, название игры. | Три строки: `Имя: ИМЯ`, `Книга: КНИГА`, `Игра: ИГРА`. После двоеточия ровно один пробел. |

**Ожидаемый результат.** Три строки: `Имя: ИМЯ`, `Книга: КНИГА`, `Игра: ИГРА`. После двоеточия ровно один пробел.

**Ограничения.** Все строки непустые, не длиннее 80 символов; названия могут содержать пробелы.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Лена<br>Хоббит<br>Шахматы</pre> | <pre>Имя: Лена<br>Книга: Хоббит<br>Игра: Шахматы</pre> |
| <pre>Марк<br>Алиса в Стране чудес<br>Морской бой</pre> | <pre>Имя: Марк<br>Книга: Алиса в Стране чудес<br>Игра: Морской бой</pre> |

**Пояснение.** Подписи позволяют отличить ответы; их порядок совпадает с порядком ввода.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5737064c087e16c8','text-input-output',NULL,NULL,'Сообщение курьера · по выбору','code','**Сюжет.** Диспетчер записал два кодовых слова в обратном порядке. Курьеру нужно восстановить сообщение.

**Задача.** Прочитайте два слова. Выведите сначала второе, затем первое, разделив их строкой ` -> `.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: по одному слову в строке. | Одна строка: `ВТОРОЕ -> ПЕРВОЕ`. |

**Ожидаемый результат.** Одна строка: `ВТОРОЕ -> ПЕРВОЕ`.

**Ограничения.** Каждое слово содержит от 1 до 20 символов без пробелов; регистр сохраняется.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>старт<br>финиш</pre> | <pre>финиш -&gt; старт</pre> |
| <pre>А<br>Б</pre> | <pre>Б -&gt; А</pre> |

**Пояснение.** В выводе меняется порядок слов, а не порядок букв внутри них.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1f8332a920ffe72b','numbers-and-conditions',NULL,NULL,'Выведи сумму двух чисел и их произведение.','code','**Задача.** Выведи сумму двух чисел и их произведение. Подставь свои значения.

**Ожидаемый результат.** В выводе представлены сумма и произведение выбранных двух чисел.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6d4c00ca79b76db3','numbers-and-conditions',NULL,NULL,'Любимое число','code','**Задача.** Попроси пользователя ввести номер любимого числа и выведи ответ с пояснением.

**Ожидаемый результат.** После ввода номера программа показывает его и поясняющий текст.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-30ce9a461c912350','numbers-and-conditions',NULL,NULL,'Сумма двух целых чисел','code','**Задача.** Попроси два целых числа, преобразуй оба ответа и выведи сумму.

**Ожидаемый результат.** Два введённых значения преобразованы в целые числа, а программа выводит их сумму.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-83c41374c0d44ed6','numbers-and-conditions',NULL,NULL,'Сравни возраст с числом 12 с помощью >=.','code','**Задача.** Сравни возраст с числом 12 с помощью `>=`. Выведи полученный ответ.

**Ожидаемый результат.** Проверка даёт `True` для возраста 12 и старше и `False` для возраста меньше 12.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-451355c690403631','numbers-and-conditions',NULL,NULL,'Спроси число.','code','**Задача.** Спроси число. Если оно равно 10, выведи «Нашли десять», иначе — «Это другое число».

**Ожидаемый результат.** Для числа 10 выводится `Нашли десять`, для любого другого введённого числа — `Это другое число`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-acc85edb4568225e','numbers-and-conditions',NULL,NULL,'Спроси температуру.','code','**Задача.** Спроси температуру. Для значений ниже 0 напечатай «мороз», для значений от 0 до 20 включительно — «прохладно», иначе — «тепло».

**Ожидаемый результат.** Сообщение выбирается согласно трём диапазонам: ниже 0, от 0 до 20 включительно и выше 20.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bba10ae38d11ddb0','numbers-and-conditions',NULL,NULL,'Проверь, находится ли число в промежутке от 1 до 10 включительно: одновременно number >= 1 и number <= 10.','code','**Задача.** Проверь, находится ли число в промежутке от 1 до 10 включительно: одновременно `number >= 1` и `number <= 10`.

**Ожидаемый результат.** Логическое выражение истинно для чисел от 1 до 10 включительно и ложно вне этого диапазона.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fcd61f9930f78cf2','numbers-and-conditions',NULL,NULL,'Билет доступен от 12 до 16 лет включительно.','code','**Задача.** Билет доступен от 12 до 16 лет включительно. Напиши проверку и проверь возраст 11, 12, 16, 17. Ожидаются ответы: нет, да, да, нет.

**Ожидаемый результат.** Проверка граничных значений возвращает ответы в указанном порядке для возрастов 11, 12, 16 и 17.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b92c2704200342db','numbers-and-conditions',NULL,NULL,'Запасы двух складов · обязательная','code','**Сюжет.** Экспедиция получила ящики с двух складов.

**Задача.** Найдите общее количество ящиков.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: целые количества `a` и `b`. | Одно целое число — сумма запасов. |

**Ожидаемый результат.** Одно целое число — сумма запасов.

**Ограничения.** 0 ≤ a, b ≤ 10000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>12<br>5</pre> | <pre>17</pre> |
| <pre>0<br>0</pre> | <pre>0</pre> |

**Пояснение.** Если оба склада пусты, общий запас равен нулю.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-98e6afccf8a0f6f4','numbers-and-conditions',NULL,NULL,'Кристаллы для экспедиции · обязательная','code','**Сюжет.** Команда раскладывает кристаллы в одинаковые контейнеры, заполняя их целиком.

**Задача.** Найдите число полных контейнеров и количество оставшихся кристаллов.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: число кристаллов `n`, затем вместимость контейнера `k`. | Два целых числа через пробел: полные контейнеры, затем остаток. |

**Ожидаемый результат.** Два целых числа через пробел: полные контейнеры, затем остаток.

**Ограничения.** 0 ≤ n ≤ 10000; 1 ≤ k ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>17<br>5</pre> | <pre>3 2</pre> |
| <pre>0<br>5</pre> | <pre>0 0</pre> |
| <pre>20<br>5</pre> | <pre>4 0</pre> |

**Пояснение.** 17 кристаллов заполняют три контейнера по 5; ещё 2 остаются.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a9c657ad82db9769','numbers-and-conditions',NULL,NULL,'Проверка пустого резервуара · обязательная','code','**Сюжет.** Датчик передаёт количество литров в резервуаре.

**Задача.** Сообщите, пуст ли резервуар.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое количество литров `v`. | `Пусто`, если воды нет; иначе `Вода есть`. |

**Ожидаемый результат.** `Пусто`, если воды нет; иначе `Вода есть`.

**Ограничения.** 0 ≤ v ≤ 10000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>0</pre> | <pre>Пусто</pre> |
| <pre>1</pre> | <pre>Вода есть</pre> |

**Пояснение.** Даже один литр означает, что резервуар не пуст.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-623f5926e4989ea8','numbers-and-conditions',NULL,NULL,'Пропуск в мастерскую · обязательная','code','**Сюжет.** Самостоятельно работать в мастерской разрешают с 14 лет.

**Задача.** По возрасту определите, разрешён ли вход.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целый возраст `age`. | `Можно`, если возраст не меньше 14; иначе `Пока рано`. |

**Ожидаемый результат.** `Можно`, если возраст не меньше 14; иначе `Пока рано`.

**Ограничения.** 0 ≤ age ≤ 120.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>13</pre> | <pre>Пока рано</pre> |
| <pre>14</pre> | <pre>Можно</pre> |

**Пояснение.** Четырнадцатилетний посетитель уже проходит по правилу.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ac78ec4d2061edb6','numbers-and-conditions',NULL,NULL,'Температура груза · обязательная','code','**Сюжет.** Для перевозки нужно определить, ниже ли температура груза нуля.

**Задача.** Разделите показания на три случая: ниже нуля, выше нуля и ровно ноль.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целая температура `t`. | `Ниже нуля`, `Выше нуля` или `Ровно ноль` — одна строка. |

**Ожидаемый результат.** `Ниже нуля`, `Выше нуля` или `Ровно ноль` — одна строка.

**Ограничения.** −100 ≤ t ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>-3</pre> | <pre>Ниже нуля</pre> |
| <pre>0</pre> | <pre>Ровно ноль</pre> |
| <pre>5</pre> | <pre>Выше нуля</pre> |

**Пояснение.** Ноль образует отдельный случай, он не положительный и не отрицательный.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-672bb4540e001afb','numbers-and-conditions',NULL,NULL,'Результат испытания · по выбору','code','**Сюжет.** Учебный центр переводит баллы испытания в оценку.

**Задача.** За 85–100 баллов поставьте 5, за 70–84 — 4, за 50–69 — 3, за 0–49 предложите повторить попытку.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое число баллов `score`. | Одна строка: `5`, `4`, `3` или `Попробуй ещё раз`. |

**Ожидаемый результат.** Одна строка: `5`, `4`, `3` или `Попробуй ещё раз`.

**Ограничения.** 0 ≤ score ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>84</pre> | <pre>4</pre> |
| <pre>85</pre> | <pre>5</pre> |
| <pre>49</pre> | <pre>Попробуй ещё раз</pre> |

**Пояснение.** 84 балла ещё не дают пятёрку; 85 уже дают.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e59a4162eb663a42','numbers-and-conditions',NULL,NULL,'Хранение лекарства · по выбору','code','**Сюжет.** Лекарство можно хранить при температуре от 10 до 20 градусов включительно.

**Задача.** Определите, нарушены ли условия хранения.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целая температура `t`. | `Нарушение`, если температура вне допустимого диапазона; иначе `Норма`. |

**Ожидаемый результат.** `Нарушение`, если температура вне допустимого диапазона; иначе `Норма`.

**Ограничения.** −50 ≤ t ≤ 50.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>10</pre> | <pre>Норма</pre> |
| <pre>21</pre> | <pre>Нарушение</pre> |
| <pre>9</pre> | <pre>Нарушение</pre> |

**Пояснение.** Обе границы входят в разрешённый диапазон.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-29a6a9da918865da','numbers-and-conditions',NULL,NULL,'Лучший результат · по выбору','code','**Сюжет.** Три участника доставили разное или одинаковое число посылок.

**Задача.** Выведите наибольшее из трёх количеств.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: целые количества `a`, `b`, `c`. | Одно целое число — наибольший результат. Имя победителя определять не нужно. |

**Ожидаемый результат.** Одно целое число — наибольший результат. Имя победителя определять не нужно.

**Ограничения.** 0 ≤ a, b, c ≤ 1000. Результаты могут совпадать.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>9<br>2</pre> | <pre>9</pre> |
| <pre>7<br>7<br>3</pre> | <pre>7</pre> |

**Пояснение.** При равных лучших результатах число выводится один раз.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7594de7c9e74ec4e','numbers-and-conditions',NULL,NULL,'Возраст по календарю · по выбору','code','**Сюжет.** Для предварительной заявки учитывают возраст, которого человек достигнет в текущем году.

**Задача.** Вычислите разность текущего года и года рождения. Выведите её и сообщите, достигнет ли человек 18 лет к концу года. Точная дата рождения не учитывается.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: год рождения `birth`, затем текущий год `year`. | Две строки: целый возраст, затем `Совершеннолетний` при возрасте от 18 лет либо `Несовершеннолетний`. |

**Ожидаемый результат.** Две строки: целый возраст, затем `Совершеннолетний` при возрасте от 18 лет либо `Несовершеннолетний`.

**Ограничения.** 1900 ≤ birth ≤ year ≤ 2100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2010<br>2027</pre> | <pre>17<br>Несовершеннолетний</pre> |
| <pre>2010<br>2028</pre> | <pre>18<br>Совершеннолетний</pre> |

**Пояснение.** В 2028 году родившемуся в 2010 году исполнится 18 лет.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9bcd8dddf8a51bc4','numbers-and-conditions',NULL,NULL,'Календарь выставок · по выбору','code','**Сюжет.** Организатор сортирует заявки по половинам года. Иногда вместо месяца приходит неверное число.

**Задача.** Для месяцев 1–6 выберите первую половину года, для 7–12 — вторую. Остальные числа обозначьте как неверный месяц.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое число `month`. | `Первая половина года`, `Вторая половина года` или `Такого месяца нет`. |

**Ожидаемый результат.** `Первая половина года`, `Вторая половина года` или `Такого месяца нет`.

**Ограничения.** −100 ≤ month ≤ 100. Проверка числа вне 1–12 входит в задачу.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>6</pre> | <pre>Первая половина года</pre> |
| <pre>7</pre> | <pre>Вторая половина года</pre> |
| <pre>13</pre> | <pre>Такого месяца нет</pre> |

**Пояснение.** Июнь завершает первую половину года, июль начинает вторую.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-68d0fea45504118b','numbers-and-conditions',NULL,NULL,'Парные значки · по выбору','code','**Сюжет.** Все значки нужно раздать парами, без остатка.

**Задача.** Определите, делится ли количество значков на 2.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое количество `n`. | `Да`, если значки можно разбить на пары; иначе `Нет`. |

**Ожидаемый результат.** `Да`, если значки можно разбить на пары; иначе `Нет`.

**Ограничения.** 0 ≤ n ≤ 10000. Ноль значков считается подходящим количеством: остатка нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>0</pre> | <pre>Да</pre> |
| <pre>1</pre> | <pre>Нет</pre> |
| <pre>2</pre> | <pre>Да</pre> |

**Пояснение.** Важно проверить нулевой запас и минимальную полную пару.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ddefb6ef52e2c49e','numbers-and-conditions',NULL,NULL,'Каркас палатки · по выбору','code','**Сюжет.** Мастера выбирают три рейки, чтобы сделать треугольный каркас.

**Задача.** Определите, можно ли составить невырожденный треугольник. Он существует, только если каждая сторона меньше суммы двух остальных.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: целые длины `a`, `b`, `c`. | `Треугольник существует` или `Треугольник не существует`. |

**Ожидаемый результат.** `Треугольник существует` или `Треугольник не существует`.

**Ограничения.** 1 ≤ a, b, c ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>4<br>5</pre> | <pre>Треугольник существует</pre> |
| <pre>2<br>3<br>5</pre> | <pre>Треугольник не существует</pre> |

**Пояснение.** При равенстве 2 + 3 = 5 рейки лежат на одной прямой; такой каркас не подходит.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a0b7ec0669e5ab13','numbers-and-conditions',NULL,NULL,'Доступ в клуб · по выбору','code','**Сюжет.** Взрослые посетители входят свободно. Подростки с 13 лет могут войти по кодовому слову.

**Задача.** Разрешите вход человеку от 18 лет при любом слове либо человеку от 13 до 17 лет со словом `python`. Все остальные получают отказ.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: целый возраст `age`, затем кодовое слово. | `Вход разрешён` или `Вход запрещён`. |

**Ожидаемый результат.** `Вход разрешён` или `Вход запрещён`.

**Ограничения.** 0 ≤ age ≤ 120; слово содержит 1–20 строчных латинских букв.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>13<br>python</pre> | <pre>Вход разрешён</pre> |
| <pre>12<br>python</pre> | <pre>Вход запрещён</pre> |
| <pre>18<br>guest</pre> | <pre>Вход разрешён</pre> |

**Пояснение.** Верный код не отменяет минимальный возраст 13 лет; взрослому код не нужен.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c139cc474dd9b6fd','numbers-and-conditions',NULL,NULL,'Делим арбуз · по выбору','code','**Сюжет.** Два друга хотят разделить арбуз так, чтобы каждому достался положительный чётный вес.

**Задача.** Определите, можно ли представить общую массу как сумму двух положительных чётных целых чисел.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целая масса `w`. | `YES`, если такое разделение возможно; иначе `NO`. |

**Ожидаемый результат.** `YES`, если такое разделение возможно; иначе `NO`.

**Ограничения.** 1 ≤ w ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>8</pre> | <pre>YES</pre> |
| <pre>2</pre> | <pre>NO</pre> |
| <pre>3</pre> | <pre>NO</pre> |

**Пояснение.** 8 можно разделить на 2 и 6; массу 2 нельзя разделить на две положительные чётные части.

**Источник.** Адаптация [Codeforces 4A — Watermelon](https://codeforces.com/problemset/problem/4/A). Условие пересказано; ввод, ограничения и ответы YES/NO сохранены; добавлены граничные примеры.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8b811d904386627d','truthiness-and-conditions',NULL,NULL,'Не запуская, укажи, какую строку напечатает каждая пара значений.','code','**Задача.** Для значений `value` в показанной программе вручную предскажи напечатанную строку, затем запусти фрагмент и сравни результат.

```python
value = 0
if value:
    print(value, "да")
else:
    print(value, "нет")

value = 1
if value:
    print(value, "да")
else:
    print(value, "нет")

value = -1
if value:
    print(value, "да")
else:
    print(value, "нет")
```

**Ожидаемый результат.** Для каждого из трёх значений записана строка, которую печатает программа; предсказание сверено запуском.

**Что сдать.** Предсказание для каждого значения и проверка запуска программы.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-44dda53000746f7f','truthiness-and-conditions',NULL,NULL,'Напиши программу, которая получает число мест seats.','code','**Задача.** Получи целое число `seats` — количество мест. Напечатай `Есть место`, если `seats` больше нуля. Во всех остальных случаях напечатай `Мест нет`. Проверь значения `0`, `1` и `-1`.

**Ожидаемый результат.** Для `1` выводится `Есть место`; для `0` и `-1` — `Мест нет`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-933593df699e30b5','truthiness-and-conditions',NULL,NULL,'Для уже изученной строки ответа проверь, совпадает ли она с "да" или "д".','code','**Задача.** Для уже изученной строки ответа проверь, совпадает ли она с `"да"` или `"д"`. Сделай таблицу проверки для `"да"`, `"д"`, `"нет"`.

**Ожидаемый результат.** Таблица проверки показывает совпадение для `да` и `д` и отсутствие совпадения для `нет`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-85da4c38b74aeffb','truthiness-and-conditions',NULL,NULL,'Объясни разницу между числом 0 и строкой "0", а также между "" и строкой из пробела.','text','**Задача.** Объясни разницу между числом `0` и строкой `"0"`, а также между `""` и строкой из пробела.

**Ожидаемый результат.** Объяснение для каждого из четырёх значений указывает тип данных и результат проверки истинности; отдельно объяснено, почему строка с пробелом не пустая.

**Что сдать.** Краткое объяснение различий для всех четырёх значений.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b0c8c83f46bf09e9','truthiness-and-conditions',NULL,NULL,'Пустое сообщение · обязательная','code','**Сюжет.** Робот принимает текст сообщения. Даже один символ означает, что сообщение поступило.

**Задача.** Проверьте, пуста ли введённая строка. Пробелы и цифры считаются обычными символами.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка `message`, которая может быть пустой. | `Сообщение получено`, если строка непустая; иначе `Нет сообщения`. |

**Ожидаемый результат.** `Сообщение получено`, если строка непустая; иначе `Нет сообщения`.

**Ограничения.** От 0 до 80 символов. Не удаляйте пробелы и не преобразовывайте текст в число.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <em>Пустая строка (Enter)</em> | <pre>Нет сообщения</pre> |
| <pre>0</pre> | <pre>Сообщение получено</pre> |

**Пояснение.** Первый ввод — одно нажатие Enter без символов. Строка «0» содержит символ и потому не пуста.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dd22651512996a42','truthiness-and-conditions',NULL,NULL,'Места на экскурсию · обязательная','code','**Сюжет.** Знак числа свободных мест важен: отрицательное значение означает переполненную заявку.

**Задача.** Выведите «Есть места» при положительном количестве, «Мест нет» при нуле, «Перебор заявок» при отрицательном количестве.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое число `seats`. | Одна строка: `Есть места`, `Мест нет` или `Перебор заявок`. |

**Ожидаемый результат.** Одна строка: `Есть места`, `Мест нет` или `Перебор заявок`.

**Ограничения.** −100 ≤ seats ≤ 100. Отрицательные значения разрешены.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>0</pre> | <pre>Мест нет</pre> |
| <pre>-1</pre> | <pre>Перебор заявок</pre> |
| <pre>1</pre> | <pre>Есть места</pre> |

**Пояснение.** Проверки «значение ненулевое» недостаточно: −1 и 1 должны давать разные ответы.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9d5d77d54580f3bb','truthiness-and-conditions',NULL,NULL,'Пропуск с именем · обязательная','code','**Сюжет.** Турникет разрешает вход только по действующему коду и с заполненным именем.

**Задача.** Разрешите вход, если имя непустое, а числовой код равен 2026. Иначе откажите.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя, затем целый код. | `Добро пожаловать, ИМЯ!` при разрешённом входе; иначе `Доступ закрыт`. |

**Ожидаемый результат.** `Добро пожаловать, ИМЯ!` при разрешённом входе; иначе `Доступ закрыт`.

**Ограничения.** Длина имени от 0 до 30 символов; имя состоит из букв и не содержит пробелов. 0 ≤ код ≤ 9999.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Аня<br>2026</pre> | <pre>Добро пожаловать, Аня!</pre> |
| <pre><br>2026</pre> | <pre>Доступ закрыт</pre> |
| <pre>Аня<br>0</pre> | <pre>Доступ закрыт</pre> |

**Пояснение.** Во втором примере первая строка пустая; верный код сам по себе не даёт доступ.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-208b1a9839069cc5','truthiness-and-conditions',NULL,NULL,'Ответ на приглашение · по выбору','code','**Сюжет.** Бот принимает два варианта согласия на участие в игре.

**Задача.** Считайте согласием только ответы `да` и `д`. Любая другая строка означает отказ.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка ответа, возможно пустая. | `Участие подтверждено` при согласии; иначе `Участие отменено`. |

**Ожидаемый результат.** `Участие подтверждено` при согласии; иначе `Участие отменено`.

**Ограничения.** От 0 до 20 символов; регистр важен. Например, `Да` не совпадает с `да`.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>д</pre> | <pre>Участие подтверждено</pre> |
| <em>Пустая строка (Enter)</em> | <pre>Участие отменено</pre> |
| <pre>Да</pre> | <pre>Участие отменено</pre> |

**Пояснение.** Сокращение «д» допустимо; пустой ответ и другой регистр не входят в два разрешённых варианта.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-81c958de90a0baeb','truthiness-and-conditions',NULL,NULL,'Вода для команды · по выбору','code','**Сюжет.** Команда рассчитывает, хватит ли воды из общего запаса: каждому требуется не меньше двух литров.

**Задача.** Если участников больше нуля и запаса хватит каждому на два литра, подтвердите готовность. Если участников нет или воды не хватает, напечатайте отказ.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: целое число участников `people`, затем целое количество литров `water`. | `Можно отправляться` или `Подготовка не завершена`. |

**Ожидаемый результат.** `Можно отправляться` или `Подготовка не завершена`.

**Ограничения.** 0 ≤ people ≤ 100; 0 ≤ water ≤ 1000. Делить на ноль нельзя: случай без участников должен дать отказ.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>6</pre> | <pre>Можно отправляться</pre> |
| <pre>3<br>5</pre> | <pre>Подготовка не завершена</pre> |
| <pre>0<br>6</pre> | <pre>Подготовка не завершена</pre> |

**Пояснение.** Ровно двух литров на человека достаточно. Запас воды не разрешает отправление команды из нуля участников.

**Источник.** Авторская задача курса.

<details>
<summary>Подсказка после самостоятельной попытки</summary>

Если проверяешь количество воды на одного участника, сначала убедись, что участников больше нуля. Вспомни, когда правая часть and не вычисляется.

</details>',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-95bbf1e5e9c79514','python-quick-reference',NULL,NULL,'Задание 1. Знакомство','code','**Задача.** Запроси у пользователя имя, возраст и город. Выведи сведения тремя строками в указанном формате, подставив введённые значения:

```text
Меня зовут: Алекс
Мне 18 лет
Я живу в: Хельсинки
```

Используй `input()` и f-строку.

**Ожидаемый результат.** После ввода программа печатает имя, возраст и город — каждый на своей строке, как в примере.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-21f2e685c364174c','python-quick-reference',NULL,NULL,'Задание 2. Расчёт возраста','code','**Задача.** Запроси у пользователя имя, год рождения и текущий год. Преобразуй оба года в числа с помощью `int()` и вычти год рождения из текущего года. Выведи сообщение по образцу:

```text
Алекс, вам примерно 18 лет.
```

Для проверки используй имя `Алекс`, год рождения `2008` и текущий год `2026`.

**Ожидаемый результат.** Для указанных тестовых данных выводится `Алекс, вам примерно 18 лет.`; для других введённых данных показывается имя пользователя и вычисленная разница между годами.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9568f1bf1712ba1e','python-quick-reference',NULL,NULL,'Задание 3. Чек','code','**Задача.** Запроси название товара, его цену и количество. Используя переменные, `input()`, `int()` или `float()` и f-строку, рассчитай общую стоимость и выведи чек:

```text
Товар: Яблоки
Цена: 2.5 €
Количество: 4
Итого: 10.0 €
```

**Ожидаемый результат.** В чеке указаны введённые товар, цена и количество, а строка «Итого» содержит произведение цены на количество.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b275c925fcc14140','python-quick-reference',NULL,NULL,'Задание 4. `sep` и `end`','code','**Задача.** Самостоятельно составь программу, которая с помощью `print()`, параметров `sep` и `end` выводит информацию как минимум в три строки. Попробуй разные значения разделителя:

```python
sep=" | "
sep="-"
sep=", "
```

Также попробуй разные значения `end`.

**Ожидаемый результат.** Программа выводит не менее трёх строк; выбранные `sep` и `end` меняют разделение значений и окончание строк.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a3121aa8b8c98fec','python-quick-reference',NULL,NULL,'Задание 5. Мини-профиль','code','**Задача.** Запроси у пользователя имя, фамилию, возраст, профессию и любимый язык программирования. С помощью f-строк выведи оформленный профиль по образцу:

```text
=== Профиль ===
Имя: Алекс Иванов
Возраст: 18
Профессия: Студент
Любимый язык: Python
```

**Ожидаемый результат.** Профиль содержит заголовок и введённые имя с фамилией, возраст, профессию и любимый язык.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a1dea3057cae17dd','for-step-by-step',NULL,NULL,'Задание на предсказание','text','**Задача.** До запуска проследи показанный код: выпиши каждую строку вывода в порядке появления и укажи их общее количество. Затем выполни программу и сравни результат.

```python
for step in range(2):
    print("Начало", step)
    print("Продолжаем")
print("Цикл закончился")
```

**Ожидаемый результат.** Ответ перечисляет все строки вывода в правильном порядке и указывает их количество; результат проверен запуском.

**Что сдать.** Список прогнозируемых строк, их количество и сверка с запуском.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b267e05f8994d850','for-step-by-step',NULL,NULL,'Практика чтения','text','**Задача.** Заполни на бумаге таблицу для `range(3, 8, 2)`: запиши в порядке обхода все значения, которые получит `n`. Затем проверь цикл:

```python
for n in range(3, 8, 2):
    print(n)
```

**Ожидаемый результат.** В таблице записаны значения `n` в порядке обхода; при запуске цикла они появляются по одному на строке.

**Что сдать.** Заполненная таблица значений `n`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f7d63c190d6fbaf9','for-step-by-step',NULL,NULL,'Задание: поменяй программу','code','**Задача.** Измени показанную программу: вместо квадрата для каждого числа от 1 до `N` вычисляй куб. Куб — это число, умноженное на себя три раза. Подсказка: `number * number * number`.

```python
n = int(input("Введите N: "))

for number in range(1, n + 1):
    square = number * number
    print(f"{number} в квадрате = {square}")
```

**Ожидаемый результат.** Для каждого целого числа от 1 до `N` программа выводит его куб, а не квадрат.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dd5669b8a51559d5','for-step-by-step',NULL,NULL,'Посчитай сумму чётных чисел от 1 до n включительно.','code','**Задача.** Посчитай сумму чётных чисел от 1 до `n` включительно. Проверь `n = 1` → 0, `n = 2` → 2, `n = 6` → 12. Объясни, почему начальное значение суммы равно нулю.

**Ожидаемый результат.** Для контрольных значений получаются суммы из условия; ответ также объясняет, почему начальная сумма равна нейтральному значению сложения.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7c353a4df2a9fbb4','for-step-by-step',NULL,NULL,'Сигналы маяка · обязательная','code','**Сюжет.** Маяк отправляет одинаковое сообщение несколько раз.

**Задача.** Выведите сообщение ровно n раз. Используйте for.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Первая строка — сообщение; вторая — целое n. | По одной копии сообщения на строке. При n=0 ничего не выводите. |

**Ожидаемый результат.** По одной копии сообщения на строке. При n=0 ничего не выводите.

**Ограничения.** Сообщение непустое, до 40 символов; 0 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Привет<br>3</pre> | <pre>Привет<br>Привет<br>Привет</pre> |
| <pre>Старт<br>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b43509ed337963ad','for-step-by-step',NULL,NULL,'Номера экспедиции · обязательная','code','**Сюжет.** Каждый участник получает номер по порядку.

**Задача.** Выведите номера от 1 до n включительно.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Номера по одному на строке; при n=0 вывод пустой. |

**Ожидаемый результат.** Номера по одному на строке; при n=0 вывод пустой.

**Ограничения.** 0 ≤ n ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>1<br>2<br>3</pre> |
| <pre>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-66b94d4bd6dc1e6b','for-step-by-step',NULL,NULL,'Площадь квадратных участков · обязательная','code','**Сюжет.** Картограф рассматривает участки со сторонами от 1 до n метров.

**Задача.** Для каждой стороны выведите её длину и площадь квадрата.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | n строк вида «сторона площадь» через пробел. |

**Ожидаемый результат.** n строк вида «сторона площадь» через пробел.

**Ограничения.** 1 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>1 1<br>2 4<br>3 9</pre> |
| <pre>1</pre> | <pre>1 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-96cecc9761623838','for-step-by-step',NULL,NULL,'Бананы для солдата · повторение','code','**Сюжет.** Покупатель платит за первый банан k монет, за второй 2k, за третий 3k и так далее.

**Задача.** Найдите недостающую сумму для w бананов, если уже есть n монет. Если денег хватает, ответ 0.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: k, n, w. | Одно целое число — недостающая сумма. |

**Ожидаемый результат.** Одно целое число — недостающая сумма.

**Ограничения.** 1 ≤ k,w ≤ 1000; 0 ≤ n ≤ 1000000000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>17<br>4</pre> | <pre>13</pre> |
| <pre>2<br>20<br>3</pre> | <pre>0</pre> |

**Источник.** Адаптация [Codeforces 546A — Soldier and Bananas](https://codeforces.com/problemset/problem/546/A). Условие пересказано. Числа читаются с трёх строк вместо одной, поэтому чтение ввода нужно изменить перед отправкой на Codeforces.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-abe2db74bb352dde','for-step-by-step',NULL,NULL,'Чётные ячейки · по выбору','code','**Сюжет.** Склад выдаёт ячейки с чётными номерами.

**Задача.** Для номеров от 1 до n выведите чётные номера, затем их количество и сумму.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Сначала подходящие номера по одному на строке, затем строка «Количество: K» и строка «Сумма: S». Если подходящих номеров нет, выведите только две итоговые строки с нулями. |

**Ожидаемый результат.** Сначала подходящие номера по одному на строке, затем строка «Количество: K» и строка «Сумма: S». Если подходящих номеров нет, выведите только две итоговые строки с нулями.

**Ограничения.** 0 ≤ n ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>5</pre> | <pre>2<br>4<br>Количество: 2<br>Сумма: 6</pre> |
| <pre>1</pre> | <pre>Количество: 0<br>Сумма: 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-421b69fd0e2442d3','for-step-by-step',NULL,NULL,'Таблица стоимости · по выбору','code','**Сюжет.** Один жетон стоит a рублей. Кассиру нужны цены наборов от одного до десяти жетонов.

**Задача.** Выведите количество жетонов и стоимость каждого набора.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое a. | 10 строк вида «количество стоимость», разделённых пробелом. |

**Ожидаемый результат.** 10 строк вида «количество стоимость», разделённых пробелом.

**Ограничения.** 0 ≤ a ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2</pre> | <pre>1 2<br>2 4<br>3 6<br>4 8<br>5 10<br>6 12<br>7 14<br>8 16<br>9 18<br>10 20</pre> |
| <pre>0</pre> | <pre>1 0<br>2 0<br>3 0<br>4 0<br>5 0<br>6 0<br>7 0<br>8 0<br>9 0<br>10 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ef1f3ad6af15dc51','for-step-by-step',NULL,NULL,'Резервная линия · по выбору','code','**Сюжет.** Датчики нумеруются от 1 до n. На резервную линию попадают номера, кратные 2 или 5.

**Задача.** Посчитайте подходящие номера. Число, кратное обоим делителям, учитывается один раз.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое количество. |

**Ожидаемый результат.** Одно целое количество.

**Ограничения.** 0 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>10</pre> | <pre>6</pre> |
| <pre>1</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8aad7606fe26ef6f','for-step-by-step',NULL,NULL,'Квадратные панели · по выбору','code','**Сюжет.** Для ступени i требуется i² небольших панелей.

**Задача.** Найдите общее число панелей для ступеней от 1 до n.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое число. |

**Ожидаемый результат.** Одно целое число.

**Ограничения.** 0 ≤ n ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>14</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-721adca49393a436','for-step-by-step',NULL,NULL,'Пропуск на участок · по выбору','code','**Сюжет.** Инспектор обходит участки от 1 до n; доступ разрешён только номерам больше 3 и меньше 8.

**Задача.** Для каждого номера выведите его и статус.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | n строк: номер, пробел, «доступ» либо «закрыто». |

**Ожидаемый результат.** n строк: номер, пробел, «доступ» либо «закрыто».

**Ограничения.** 1 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4</pre> | <pre>1 закрыто<br>2 закрыто<br>3 закрыто<br>4 доступ</pre> |
| <pre>1</pre> | <pre>1 закрыто</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-296a621b43815217','for-practice',NULL,NULL,'Перекличка роботов · обязательная','code','**Сюжет.** Контролёр приветствует роботов одной серии.

**Задача.** Получите имя серии и число роботов. Напечатайте приветствие для каждого.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя и n. | n строк «Привет, ИМЯ!». При n=0 вывод пустой. |

**Ожидаемый результат.** n строк «Привет, ИМЯ!». При n=0 вывод пустой.

**Ограничения.** Имя до 30 символов; 0 ≤ n ≤ 20.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Луна<br>2</pre> | <pre>Привет, Луна!<br>Привет, Луна!</pre> |
| <pre>Луч<br>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-535d1461fb881317','for-practice',NULL,NULL,'Контрольные метки · обязательная','code','**Сюжет.** Маршрут содержит метки с номерами от 1 до n.

**Задача.** Напечатайте все номера меток.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | По номеру на строке; при n=0 вывод пустой. |

**Ожидаемый результат.** По номеру на строке; при n=0 вывод пустой.

**Ограничения.** 0 ≤ n ≤ 30.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2</pre> | <pre>1<br>2</pre> |
| <pre>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4bbb69e2a2753244','for-practice',NULL,NULL,'Парные посты · обязательная','code','**Сюжет.** Проверка нужна только постам с чётными номерами.

**Задача.** Выведите чётные номера от 1 до n.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | По номеру на строке; если номеров нет, вывод пустой. |

**Ожидаемый результат.** По номеру на строке; если номеров нет, вывод пустой.

**Ограничения.** 0 ≤ n ≤ 30.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>6</pre> | <pre>2<br>4<br>6</pre> |
| <pre>1</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-22b7e4a0553c694c','for-practice',NULL,NULL,'План сада · повторение','code','**Сюжет.** В саду строят квадратные клумбы со сторонами от 1 до n.

**Задача.** Для каждой стороны покажите её и площадь.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | n строк: сторона и площадь через пробел. |

**Ожидаемый результат.** n строк: сторона и площадь через пробел.

**Ограничения.** 1 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2</pre> | <pre>1 1<br>2 4</pre> |
| <pre>1</pre> | <pre>1 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-820d7de85ae113c0','for-practice',NULL,NULL,'Цена наборов · по выбору','code','**Сюжет.** Киоск продаёт одинаковые наборы по a рублей.

**Задача.** Подготовьте таблицу цены от одного до трёх наборов.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое a. | 3 строки: количество и цена через пробел. |

**Ожидаемый результат.** 3 строки: количество и цена через пробел.

**Ограничения.** 0 ≤ a ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>7</pre> | <pre>1 7<br>2 14<br>3 21</pre> |
| <pre>0</pre> | <pre>1 0<br>2 0<br>3 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-762629411ecb7106','for-practice',NULL,NULL,'Монеты за этапы · по выбору','code','**Сюжет.** За этап i участнику дают i монет.

**Задача.** Сложите награды первых n этапов циклом.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое число — общая награда. |

**Ожидаемый результат.** Одно целое число — общая награда.

**Ограничения.** 0 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4</pre> | <pre>10</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-30b7ea2a6a1dc2a8','for-practice',NULL,NULL,'Каждый третий · по выбору','code','**Сюжет.** Посетители получают номера от 1 до n, каждый третий — подарок.

**Задача.** Посчитайте получателей подарка.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое количество. |

**Ожидаемый результат.** Одно целое количество.

**Ограничения.** 0 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>9</pre> | <pre>3</pre> |
| <pre>2</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d0db4e354ec7c984','for-practice',NULL,NULL,'Чётные выплаты · по выбору','code','**Сюжет.** За этапы с чётными номерами выплачивают столько монет, каков номер этапа.

**Задача.** Найдите сумму выплат для этапов 1…n.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое число. |

**Ожидаемый результат.** Одно целое число.

**Ограничения.** 0 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>6</pre> | <pre>12</pre> |
| <pre>1</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f5fa1c0f211bdb6d','for-practice',NULL,NULL,'Панели по этажам · по выбору','code','**Сюжет.** На этаже i устанавливают i² панелей.

**Задача.** Найдите число панелей на первых n этажах.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое число. |

**Ожидаемый результат.** Одно целое число.

**Ограничения.** 0 ≤ n ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4</pre> | <pre>30</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c47685632a05b967','for-practice',NULL,NULL,'Метки через одну · по выбору','code','**Сюжет.** Строитель ставит метки через два метра, начиная с позиции start.

**Задача.** Выведите позиции start, start+2 и так далее, пока позиция строго меньше stop.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: start и stop. | Каждую позицию на отдельной строке; при отсутствии позиций вывод пустой. |

**Ожидаемый результат.** Каждую позицию на отдельной строке; при отсутствии позиций вывод пустой.

**Ограничения.** −20 ≤ start,stop ≤ 20. Если start ≥ stop, меток нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>7</pre> | <pre>2<br>4<br>6</pre> |
| <pre>5<br>5</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-93cfb3afe35ea931','while-and-random',NULL,NULL,'Измени программу: Сделай так, чтобы печатались числа от 1 до 6.','code','**Задача.** Напиши программу с циклом `while`, которая выводит числа от 1 до 6 включительно.

**Ожидаемый результат.** Вывод содержит последовательность от 1 до 6 в возрастающем порядке; после 6 цикл завершается.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f1781b2df0d0c711','while-and-random',NULL,NULL,'Измени программу: Измени команду увеличения: пусть счётчик каждый раз растёт на 2.','code','**Задача.** Измени программу: увеличивай `step` на 2 за итерацию и подбери условие цикла, чтобы получить значения `1, 3, 5`.

```python
step = 1

while step <= 4:
    print("Сейчас шаг", step)
    step = step + 1

print("Готово")
```

**Ожидаемый результат.** В выводе значения счётчика идут как `1, 3, 5`; условие включает 5 и завершает цикл до следующего шага.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c27f10a92d6b387d','while-and-random',NULL,NULL,'Попроси ввести число от 1 до 5.','code','**Задача.** Попроси ввести число от 1 до 5. Пока введённое число меньше 1 **или** больше 5, попроси ввести его снова. Используй `int()` и `or`.

**Ожидаемый результат.** Ввод повторяется для значений меньше 1 или больше 5; при целом числе от 1 до 5 включительно программа прекращает повтор.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-42013f8cd7a7ea0c','while-and-random',NULL,NULL,'Улучши игру','code','**Задача.** Добавь к игре счётчик попыток. Создай `attempts = 1` перед циклом, увеличивай его на 1 после каждого нового ввода и после победы выведи число попыток.

Базовая игра из урока:

```python
import random

secret = random.randint(1, 10)
guess = int(input("Угадай число от 1 до 10: "))

while guess != secret:
    if guess < secret:
        print("Моё число больше")
    else:
        print("Моё число меньше")

    guess = int(input("Попробуй ещё раз: "))

print("Верно! Ты угадал.")
```

**Ожидаемый результат.** После победы выведено количество всех введённых догадок, включая правильную.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c0dd48c12b57cd65','while-and-random',NULL,NULL,'Спроси число.','code','**Задача.** Спроси число. Повторяй ввод, пока число не будет меньше 0 или больше 100. Для продолжения используй условие `number < 0 or number > 100`.

**Ожидаемый результат.** Программа запрашивает число повторно, пока оно вне диапазона от 0 до 100; значение 0 или 100 завершает повтор.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9f7aa23d3d7020a5','while-and-random',NULL,NULL,'Выведи числа от 1 до 10, пропуская кратные 3, и остановись перед 8.','code','**Задача.** Выведи числа от 1 до 10, пропуская кратные 3, и остановись перед 8. Ожидается: 1, 2, 4, 5, 7. Реши через `for`, затем через `while`. Проверь, что в обоих случаях счётчик продвигается после пропуска.

**Ожидаемый результат.** Обе версии программы печатают `1, 2, 4, 5, 7` и продолжают счётчик после пропущенных значений.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-73c3d64bc5a9da4b','while-and-random',NULL,NULL,'Обратный отсчёт · обязательная','code','**Сюжет.** Диспетчер запускает аппарат после обратного отсчёта.

**Задача.** Выведите числа от n до 1 и затем «Старт!». Используйте while.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Числа по одному на строке и финальное сообщение; при n=0 только сообщение. |

**Ожидаемый результат.** Числа по одному на строке и финальное сообщение; при n=0 только сообщение.

**Ограничения.** 0 ≤ n ≤ 20.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>3<br>2<br>1<br>Старт!</pre> |
| <pre>0</pre> | <pre>Старт!</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e0f35d2adc556f9e','while-and-random',NULL,NULL,'Пароль шлюза · обязательная','code','**Сюжет.** Шлюз принимает пароль «луна», остальные попытки отвергает.

**Задача.** Читайте попытки до первого правильного пароля. Для каждой неправильной печатайте отказ, затем сообщение об открытии.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Несколько строк с попытками. | На каждую ошибку «Неверно»; при первом совпадении «Открыто». Дальше ввод не читается. |

**Ожидаемый результат.** На каждую ошибку «Неверно»; при первом совпадении «Открыто». Дальше ввод не читается.

**Ограничения.** Успешная попытка есть не позднее десятой строки; регистр важен.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>солнце<br>луна</pre> | <pre>Неверно<br>Открыто</pre> |
| <pre>луна</pre> | <pre>Открыто</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-032ce84e4b960f5a','while-and-random',NULL,NULL,'Выбор отсека · обязательная','code','**Сюжет.** Допустимые номера отсека — от 1 до 20 включительно.

**Задача.** Читайте числа до первого допустимого. Для отклонённых чисел сообщайте об ошибке диапазона.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| По одному целому числу на строку. | «Вне диапазона» для каждой ошибки и «Отсек N» при успехе. |

**Ожидаемый результат.** «Вне диапазона» для каждой ошибки и «Отсек N» при успехе.

**Ограничения.** −100 ≤ число ≤ 100; допустимое появится за первые 10 строк.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>0<br>21<br>20</pre> | <pre>Вне диапазона<br>Вне диапазона<br>Отсек 20</pre> |
| <pre>1</pre> | <pre>Отсек 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9da24ee54abc2e3f','while-and-random',NULL,NULL,'Безопасные показания · повторение','code','**Сюжет.** Перед пуском диспетчер проверяет датчики.

**Задача.** Получите n показаний и посчитайте, сколько лежат от 10 до 20 включительно.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Сначала n, затем n целых чисел по одному на строку. | Одно целое количество. |

**Ожидаемый результат.** Одно целое количество.

**Ограничения.** 0 ≤ n ≤ 100; −100 ≤ показание ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>9<br>10<br>20<br>21</pre> | <pre>2</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-453c224c4ca3fbbf','while-and-random',NULL,NULL,'Запасы до сигнала · по выбору','code','**Сюжет.** Склад принимает партии, пока не придёт завершающий ноль.

**Задача.** Сложите размеры партий и посчитайте их. Ноль в расчёт не входит.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Положительные целые числа по одному на строку, затем 0. | Количество и сумма через пробел. |

**Ожидаемый результат.** Количество и сумма через пробел.

**Ограничения.** Не более 100 партий, каждая до 1000; ноль обязательно присутствует.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>7<br>0</pre> | <pre>2 11</pre> |
| <pre>0</pre> | <pre>0 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-558e7551e56db89f','while-and-random',NULL,NULL,'Тренажёр угадывания · по выбору','code','**Сюжет.** Тестовый тренажёр сообщает, больше или меньше догадка загаданного числа.

**Задача.** Первая строка задаёт секрет для проверки. Читайте догадки до совпадения; выведите число всех догадок, включая верную.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Секрет, затем догадки по одному целому на строку. | Для неверной догадки «Больше», если секрет больше, иначе «Меньше». При совпадении «Угадано: K». |

**Ожидаемый результат.** Для неверной догадки «Больше», если секрет больше, иначе «Меньше». При совпадении «Угадано: K».

**Ограничения.** Все числа от 1 до 20; совпадение есть за первые 10 догадок.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>7<br>10<br>3<br>7</pre> | <pre>Меньше<br>Больше<br>Угадано: 3</pre> |
| <pre>1<br>1</pre> | <pre>Угадано: 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5d88d5cc6392d551','while-and-random',NULL,NULL,'Пять запросов · по выбору','code','**Сюжет.** У поискового робота есть не больше пяти попыток назвать секрет.

**Задача.** Первая строка ввода задаёт секретное целое число `S`. Затем программа читает до пяти догадок. Для каждой неверной догадки выведи `Больше`, если секрет больше догадки, иначе `Меньше`. Если число угадано, сразу выведи `Победа: K`, где `K` — номер догадки, и прекрати чтение ввода. Если все пять догадок неверны, на пятой попытке выведи `Проигрыш: S` вместо подсказки.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Секрет, затем не более пяти догадок; после успеха ввод прекращается. | Подсказка для каждой неверной догадки, кроме последней при поражении; затем `Победа: K` или `Проигрыш: S`. |

**Ожидаемый результат.** При успехе выводится `Победа: K`, где учитывается и верная догадка. После пяти неверных догадок выводится `Проигрыш: S`; перед этим для первых четырёх ошибок показаны подсказки.

**Ограничения.** Секрет и догадки от 1 до 20; если игрок не угадывает, во входе есть ровно пять догадок.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>1<br>1<br>1<br>1<br>2</pre> | <pre>Больше<br>Больше<br>Больше<br>Больше<br>Победа: 5</pre> |
| <pre>2<br>1<br>1<br>1<br>1<br>1</pre> | <pre>Больше<br>Больше<br>Больше<br>Больше<br>Проигрыш: 2</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2e9130096dc8daa2','while-and-random',NULL,NULL,'Игровой автомат · по выбору','code','**Сюжет.** Автомат предлагает случайное занятие: A — рисунок, B — чтение, C — прогулка.

**Задача.** Для команды «да» выбирайте код через random.choice("ABC") и печатайте соответствующее занятие. При «нет» завершите работу, для другого ответа напечатайте «Повторите команду».

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Команды по одной на строку. | Для «да» ровно одна строка из «Рисунок», «Чтение», «Прогулка»; для «нет» — «До встречи». В примерах показаны возможные результаты, они могут отличаться при запуске. |

**Ожидаемый результат.** Для «да» ровно одна строка из «Рисунок», «Чтение», «Прогулка»; для «нет» — «До встречи». В примерах показаны возможные результаты, они могут отличаться при запуске.

**Ограничения.** Не более 10 команд, последняя — «нет»; код случайный.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>нет</pre> | <pre>До встречи</pre> |
| <pre>да<br>ошибка<br>нет</pre> | <pre>Чтение<br>Повторите команду<br>До встречи</pre> |

**Пояснение.** Второй пример допустим, если автомат выбрал B. При проверке временно фиксируй выбранный код, затем верни случайный выбор.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2882e4ef64116951','while-practice',NULL,NULL,'Задание 1. Максимум до нуля','code','**Задача.** Считывай целые числа по одному, пока не встретится `0`. Ноль является признаком окончания ввода и не участвует в расчёте. Выведи максимальное из введённых до него чисел. Если первым введено `0`, выведи `Нет данных`.

**Ожидаемый результат.** Для ввода `7 -3 12 5 0` программа выводит `12`; если ввод сразу заканчивается на `0`, выводит `Нет данных`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-098bb3297814316c','while-practice',NULL,NULL,'Задание 2. Факториал числа','code','**Задача.** Для натурального `n > 0` вычисли `n!` с помощью цикла `while` и выведи результат целым числом. Факториал — произведение натуральных чисел от 1 до `n` включительно; например, `5! = 1·2·3·4·5 = 120`. По определению `0! = 1`, но в этой задаче рассматривается `n > 0`.

**Ожидаемый результат.** Для `n = 5` программа выводит целое число `120`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f04435ceccc17918','while-practice',NULL,NULL,'Задание 3. Проверка на простоту','code','**Задача.** Для натурального числа `n > 1` определи, является ли оно простым. Простое число имеет ровно два различных делителя: 1 и само себя. Используй `while` для проверки делителей; достаточно проверять делители до `√n`.

**Ожидаемый результат.** Выведи `Да`, если число простое, и `Нет` в противном случае: например, для 17 — `Да`, для 18 — `Нет`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ca8d98b8024f119b','while-practice',NULL,NULL,'Задание 4. Числа Фибоначчи до N','code','**Задача.** Для натурального `N` выведи все числа Фибоначчи, которые не превосходят `N`, используя цикл `while`. В последовательности первые два числа равны 1, а каждое следующее является суммой двух предыдущих: `1, 1, 2, 3, 5, 8, 13, ...`.

**Ожидаемый результат.** Каждое подходящее число выводится на новой строке. При `N = 10` последовательность вывода: `1`, `1`, `2`, `3`, `5`, `8`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4feced0bfbbb3348','while-practice',NULL,NULL,'Задание 5. Сумма цифр числа','code','**Задача.** Для натурального `n` вычисли и выведи сумму его цифр с помощью арифметических операций, не превращая число в строку. Последнюю цифру можно получить через `% 10`, а последнюю цифру отбросить целочисленным делением на 10 (`// 10`). Повторяй действия, пока число не станет 0.

**Ожидаемый результат.** Для `n = 1234` программа выводит `10`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9d53a61eb96a9587','while-practice',NULL,NULL,'Задание 6. Алгоритм Евклида (НОД)','code','**Задача.** Для двух натуральных чисел `a` и `b` найди наибольший общий делитель (НОД) алгоритмом Евклида с циклом `while`. НОД — наибольшее число, на которое делятся оба числа без остатка; алгоритм повторяет замену большего числа остатком от деления на меньшее, пока одно из чисел не станет нулём.

**Ожидаемый результат.** Выведи НОД введённых чисел. Например, для `48` и `18` результат — `6`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d4cf1594cdeb0d72','while-practice',NULL,NULL,'Задание 7. Обратный отсчёт с шагом','code','**Задача.** Даны целые `start` и `step`, причём `step > 0`. Используя `while`, выведи последовательность, начиная с `start` и каждый раз уменьшая число на `step`; выводи значения, пока они не станут меньше 1. Если в последовательность попадает 1, включи его.

**Ожидаемый результат.** Каждое значение выводится на новой строке. Для `start = 20`, `step = 6` получаются `20`, `14`, `8`, `2`; для `start = 10`, `step = 3` — `10`, `7`, `4`, `1`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cfeb69bf87e89037','while-practice',NULL,NULL,'Задание 8. Количество чётных до нуля','code','**Задача.** Считывай целые числа, пока не встретится `0`. Посчитай, сколько среди введённых до нуля чисел чётные; сам `0` не учитывай. Чётное число делится на 2 без остатка (`n % 2 == 0`).

**Ожидаемый результат.** Выведи количество чётных чисел. Для ввода `4 7 2 9 0` результат — `2` (числа 4 и 2).',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0045fe0a09f2a5a0','while-practice',NULL,NULL,'Задание 9. Бесконечный ввод с суммой','code','**Задача.** Считывай числа и складывай их, пока сумма не станет больше 100. Затем выведи итоговую сумму и количество введённых чисел.

**Ожидаемый результат.** Для последовательности `30, 20, 60` программа останавливается после числа 60 и выводит сумму `110` и количество `3`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-88f79579001172fb','while-practice',NULL,NULL,'Задание 10. Золотая середина','code','**Задача.** Для натурального `n` найди минимальное целое `k`, при котором сумма `1 + 2 + … + k` не меньше `n`. Выведи найденные `k` и сумму. Используй накопление суммы в цикле.

**Ожидаемый результат.** Для `n = 10` получаются `k = 4`, сумма `10`; для `n = 11` — `k = 5`, сумма `15`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-372fbd113301e0b6','nested-loops',NULL,NULL,'Задание на чтение','code','**Задача.** Проследи показанный вложенный цикл: посчитай напечатанные произведения и назови для каждого пару множителей. Затем измени внутренний цикл, оставив только пары, где второй множитель не меньше первого. Используй `if`, не создавай список.

```python
for first in range(1, 4):
    for second in range(1, 4):
        print(first * second, end=" ")
    print()
```

**Ожидаемый результат.** Для исходного цикла указаны все произведения с их парами множителей и общее число значений; изменённый код выводит только пары, удовлетворяющие условию `second >= first`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2644e0839fe36b4f','nested-loops',NULL,NULL,'Нарисуй прямоугольник шириной 2 и высотой 4 из символов @.','code','**Задача.** Нарисуй прямоугольник шириной 2 и высотой 4 из символов `@`. Напиши словами, за что отвечает каждый цикл.

**Ожидаемый результат.** Получается прямоугольник из четырёх строк по два символа `@`; в объяснении указана роль каждого цикла.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0a7820727de3432d','nested-loops',NULL,NULL,'Напечатай лестницу из чисел: для высоты 3 строки должны содержать 1, затем 1 2, затем 1 2 3.','code','**Задача.** Напечатай лестницу из чисел: для высоты 3 строки должны содержать `1`, затем `1 2`, затем `1 2 3`. Подсказка: при каждом значении внешнего счётчика внутренний цикл идёт от 1 до текущего номера строки включительно.

**Ожидаемый результат.** Вывод содержит три строки: `1`, затем `1 2`, затем `1 2 3`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d45f23674add6f06','nested-loops',NULL,NULL,'Напечатай сетку из 3 строк и 4 точек.','code','**Задача.** Напечатай сетку из 3 строк и 4 точек. Поэкспериментируй с `row` и `column`, чтобы вывести их координаты.

**Ожидаемый результат.** Сетка содержит 3 строки по 4 точки; при добавлении координат каждая точка связана с текущими значениями `row` и `column`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1328bea1eba45aa4','nested-loops',NULL,NULL,'Вручную проследи циклы на height = 0 и width = 0.','code','**Задача.** Рассмотри два случая отдельно, изменяя только одно измерение в исходной программе: сначала `height = 0`, затем `width = 0`.

```python
height = 3
width = 5

for row in range(height):
    for column in range(width):
        print("*", end="")
    print()
```

**Ожидаемый результат.** Для обоих случаев указано, какие циклы выполняются и что выводит программа; объяснение учитывает, где расположен `print()` после внутреннего цикла.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-780f5b74283d8482','nested-loops',NULL,NULL,'Схема мест в зале · обязательная','code','**Сюжет.** Места в зале нумеруются слева направо по рядам, следующий ряд продолжает нумерацию.

**Задача.** Выведите таблицу номеров от 1. Используйте внешний цикл по рядам и внутренний по местам.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: r — число рядов, c — мест в ряду. | r строк по c номеров через один пробел, без пробела в конце строки. |

**Ожидаемый результат.** r строк по c номеров через один пробел, без пробела в конце строки.

**Ограничения.** 1 ≤ r ≤ 8; 1 ≤ c ≤ 9.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>3</pre> | <pre>1 2 3<br>4 5 6</pre> |
| <pre>3<br>1</pre> | <pre>1<br>2<br>3</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-506a9c2c4d9b6e95','nested-loops',NULL,NULL,'Экран табло · обязательная','code','**Сюжет.** На табло показывают прямоугольный значок.

**Задача.** Нарисуйте h строк по w символов @.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: h, затем w. | Ровно h строк заданной ширины. |

**Ожидаемый результат.** Ровно h строк заданной ширины.

**Ограничения.** 0 ≤ h,w ≤ 10. При h=0 нет строк, при w=0 каждая строка пустая.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>3</pre> | <pre>@@@<br>@@@</pre> |
| <pre>0<br>3</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-735f14d1754474ba','nested-loops',NULL,NULL,'Ступени трибуны · обязательная','code','**Сюжет.** На ступени i нужно поместить номера от 1 до i.

**Задача.** Выведите числовую лестницу высотой n.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | n строк; на строке i числа 1…i через пробел. При n=0 вывод пустой. |

**Ожидаемый результат.** n строк; на строке i числа 1…i через пробел. При n=0 вывод пустой.

**Ограничения.** 0 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>1<br>1 2<br>1 2 3</pre> |
| <pre>1</pre> | <pre>1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dacfeb22a661ac30','nested-loops',NULL,NULL,'Таблица заказов · повторение','code','**Сюжет.** Производитель рассчитывает стоимость наборов: строки задают число изделий, столбцы — цену одного изделия.

**Задача.** Постройте таблицу произведений чисел 1…r и 1…c.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: r и c. | r строк по c произведений через пробел. |

**Ожидаемый результат.** r строк по c произведений через пробел.

**Ограничения.** 1 ≤ r,c ≤ 5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>3</pre> | <pre>1 2 3<br>2 4 6</pre> |
| <pre>1<br>1</pre> | <pre>1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-83f6612bef3c4582','algorithm-design',NULL,NULL,'Практикум 1. Сумма и количество после изучения `for`','code','**Задача.** Для `n` дней известны числа доставленных посылок. Найди их общую сумму и количество дней, когда доставили не меньше пяти посылок.

**Вход:** сначала `n`, затем `n` целых значений `deliveries`, по одному на строку. Ограничения: `1 ≤ n ≤ 100`, `0 ≤ deliveries ≤ 20`.

**Выход:** сумма и количество подходящих дней через пробел.

До написания кода заполни таблицу состояния для значений `2, 5, 0, 7` (`n = 4`): сумма начинается с нуля и меняется каждый день, счётчик начинается с нуля и увеличивается только при выполнении условия. Затем запиши пошаговый план.

**Ожидаемый результат.** Для четырёх значений `2, 5, 0, 7` вывод равен `14 2`; для одного значения `4` — `4 0`; для одного значения `5` — `5 1`. При переносе измени условие на «строго больше пяти» и укажи пример, который отличает его от исходного условия.

**Что сдать.** Программу, таблицу состояния и пошаговый план; также укажи пример, различающий условия «не меньше пяти» и «строго больше пяти».',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-33907b23983c97a2','algorithm-design',NULL,NULL,'Практикум 2. Выбор и частоты после изучения коллекций','code','**Задача.** Рассмотри непустой список времени доставки в минутах. Найди минимальное время и количество доставок, занявших не больше 30 минут. Вручную проследи, как меняется минимум при обработке каждого значения, сколько значений проходит условие и как учитывается равенство минимума.

**Ожидаемый результат.** Для `42, 30, 30, 51` минимум равен `30`, подходящих доставок `2`; для единственного значения `8` минимум `8`, подходящих `1`. Объясни, почему нельзя начинать поиск минимума с `0`, и перенеси идею счётчика на подсчёт появлений заданного числа без таблицы частот.

**Что сдать.** Ручную трассировку примеров, объяснение начального значения минимума и краткий план переноса на подсчёт появлений заданного числа.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b64f988dbac4c87f','algorithm-design',NULL,NULL,'Практикум 3. Разделение задачи на функции после изучения функций','code','**Задача.** Напиши программу, которая принимает непустой список оценок команды и порог, а затем выводит среднюю оценку и количество оценок не ниже порога. Раздели работу на три функции: одна считает сумму, вторая — число оценок, прошедших порог, третья объединяет вычисления и печатает результат. До написания кода укажи для каждой функции аргументы, возвращаемое значение и то, меняет ли она список. Функция, которая должна вернуть число, не должна вместо этого печатать его.

**Ожидаемый результат.** Для оценок `3, 4, 5` и порога `4` среднее равно `4.0`, порог прошли `2` человека. Проверь также одну оценку и случай, когда порог не прошёл никто. При изменении порога объясни, какие функции меняются и почему; вычисление среднего оставь прежним.

**Что сдать.** Код трёх функций и описание их аргументов, результатов и влияния на список.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7448d81ab12d8ebe','lists',NULL,NULL,'Создай список из четырёх любимых игр, книг или блюд.','code','**Задача.** Создай список из четырёх любимых игр, книг или блюд. Выведи первый, второй и последний элементы. Для списка из `n` элементов последний положительный индекс равен `n - 1`, а последний отрицательный — всегда `-1`.

**Ожидаемый результат.** Показаны первый, второй и последний элементы выбранного списка именно в этом порядке.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ad00e1397ad8ee37','lists',NULL,NULL,'Возьми срез списка numbers, чтобы получить [2, 3, 4].','code','**Задача.** Используй список `numbers = [0, 1, 2, 3, 4, 5, 6]`. Возьми срез, который даёт `[2, 3, 4]`, и затем выведи элементы этого списка через один. Подумай, какие значения поставить в `start` и `stop`.

**Ожидаемый результат.** На экране показаны срез `[2, 3, 4]` и элементы исходного списка через один: `[0, 2, 4, 6]`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c0374dae1b1f5104','lists',NULL,NULL,'Создай список покупок и отдельную копию для друга.','code','**Задача.** Создай список покупок и отдельную копию для друга. Замени первый товар только в копии друга по индексу. Покажи оба списка и объясни, какой командой получена копия.

**Ожидаемый результат.** Исходный список покупок не изменился; в отдельной копии изменён только первый товар. Показаны оба списка.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-3b74c15e71750f93','lists',NULL,NULL,'Задание 1. Индексы','code','**Задача.** Создай строку с названием города. Выведи первый и последний символ, количество символов и срез из первых трёх символов.

**Ожидаемый результат.** Выведены первый символ города, последний символ, количество символов и срез из первых трёх символов — в указанном порядке.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-72ed3e7ffa7d8a0d','lists',NULL,NULL,'Задание 2. Список покупок','code','**Задача.** Создай список из четырёх продуктов. Выведи второй продукт, последний продукт и количество продуктов. Замени один продукт по индексу.

**Ожидаемый результат.** Получены второй и последний продукты и количество элементов; в списке заменён выбранный продукт.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-40b071df6534b243','lists',NULL,NULL,'Задание 3. План дня','code','**Задача.** Создай список из трёх дел. Добавь дело в конец через `append()`, вставь дело в начало через `insert()`, затем удали одно дело через `remove()`. После каждого действия печатай список.

**Ожидаемый результат.** Показаны три последовательных состояния списка: после добавления в конец, вставки в начало и удаления элемента.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b8fa0505e438ebd8','lists',NULL,NULL,'Задание 4. Два списка','code','**Задача.** Создай список с двумя именами и второй список с тремя именами. Возьми две копии первого списка. Добавь второй список к одной копии через `append()`, ко второй — через `extend()`. Объясни разницу.

**Ожидаемый результат.** В одном результате второй список добавлен как один элемент через `append()`, в другом его элементы добавлены отдельно через `extend()`; разница объяснена.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0262a5efa523931c','lists',NULL,NULL,'Карточка названия · обязательная','code','**Сюжет.** Музей показывает короткие сведения о названии экспоната.

**Задача.** Прочитайте название, выведите первый символ, последний символ и длину, каждое значение на своей строке.

**Формат данных.** Одна непустая строка.

**Ожидаемый результат.** Три строки в указанном порядке.

**Ограничения.** Длина от 1 до 50 символов; регистр и пробелы сохраняются.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Компас</pre> | <pre>К<br>с<br>6</pre> |
| <pre>Я</pre> | <pre>Я<br>Я<br>1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f582abad04f93154','lists',NULL,NULL,'Контрольные грузы · обязательная','code','**Сюжет.** На ленте стоят ровно пять грузов. Проверить нужно первый, третий и последний.

**Задача.** Соберите введённые числа в список и выведите выбранные значения.

**Формат данных.** Пять целых чисел по одному на строку.

**Ожидаемый результат.** Три числа на отдельных строках.

**Ограничения.** 0 ≤ масса ≤ 100. В этом уроке числа читаются отдельно; split ещё не нужен.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>1<br>2<br>3<br>4<br>5</pre> | <pre>1<br>3<br>5</pre> |
| <pre>0<br>0<br>0<br>0<br>0</pre> | <pre>0<br>0<br>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4d1e5bed08b049fc','lists',NULL,NULL,'Архив измерений · обязательная','code','**Сюжет.** Архив хранит фиксированные измерения [10, 20, 30, 40, 50, 60].

**Задача.** Создайте этот список. Выведите срез со второго по четвёртый элемент, первые три, элементы начиная с четвёртого и элементы через один с начала.

**Формат данных.** Ввода нет: используйте заданный список.

**Ожидаемый результат.** Четыре строки, каждая — представление списка Python.

**Ограничения.** Исходный список не изменяется.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Нет ввода</pre> | <pre>[20, 30, 40]<br>[10, 20, 30]<br>[40, 50, 60]<br>[10, 30, 50]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a7e3e75ae4661f1c','lists',NULL,NULL,'Сигнальные огни · повторение','code','**Сюжет.** Оператор меняет второй из трёх сигнальных огней и добавляет запасной четвёртый.

**Задача.** Получите три цвета, новый цвет второго огня и цвет запасного. Замените второй элемент списка и добавьте запасной в конец.

**Формат данных.** Пять строк в указанном порядке.

**Ожидаемый результат.** Первая строка — список Python из четырёх цветов, вторая — его длина.

**Ограничения.** Строки непустые, до 20 символов; повторы разрешены.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>красный<br>синий<br>белый<br>зелёный<br>жёлтый</pre> | <pre>[''красный'', ''зелёный'', ''белый'', ''жёлтый'']<br>4</pre> |
| <pre>а<br>а<br>а<br>б<br>б</pre> | <pre>[''а'', ''б'', ''а'', ''б'']<br>4</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-252cfaebaeec9df7','lists',NULL,NULL,'Меню буфета · по выбору','code','**Сюжет.** В меню ["чай", "сок", "вода"] нужно добавить напиток перед соком, а сок убрать.

**Задача.** Прочитайте новый напиток, вставьте его на индекс 1 и удалите первое вхождение «сок» по значению.

**Формат данных.** Одна строка — новый напиток.

**Ожидаемый результат.** Обновлённый список Python.

**Ограничения.** Название непустое, до 30 символов и не равно «сок».

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>какао</pre> | <pre>[''чай'', ''какао'', ''вода'']</pre> |
| <pre>чай</pre> | <pre>[''чай'', ''чай'', ''вода'']</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5295de993e19e640','lists',NULL,NULL,'Багажные метки · по выбору','code','**Сюжет.** В списке ["мяч", "книга", "мяч"] повторяется метка.

**Задача.** Выведите индекс первого мяча; затем удалите элемент с индексом 1 и выведите список.

**Формат данных.** Ввода нет, список дан в условии.

**Ожидаемый результат.** Индекс и список на разных строках.

**Ограничения.** Индексы начинаются с нуля.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Нет ввода</pre> | <pre>0<br>[''мяч'', ''мяч'']</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7adc744233d3c177','lists',NULL,NULL,'Два способа упаковки · по выбору','code','**Сюжет.** Поставку [3, 4] можно добавить в список [1, 2] как одну упаковку или как два отдельных предмета.

**Задача.** На двух независимых копиях [1, 2] примените append([3, 4]) и extend([3, 4]). Выведите обе копии и исходный список.

**Формат данных.** Ввода нет.

**Ожидаемый результат.** Три представления списков на отдельных строках.

**Ограничения.** Исходный список должен остаться [1, 2].

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Нет ввода</pre> | <pre>[1, 2, [3, 4]]<br>[1, 2, 3, 4]<br>[1, 2]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e919e8aa8f34248d','lists',NULL,NULL,'Маршрут обратно · по выбору','code','**Сюжет.** Навигатор показывает название маршрута в обратном порядке букв.

**Задача.** Получите строку и создайте её перевёрнутую копию срезом. Выведите копию, затем исходную строку.

**Формат данных.** Одна строка.

**Ожидаемый результат.** Две строки: обратная и исходная. Для пустого ввода обе строки пустые.

**Ограничения.** От 0 до 50 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>река</pre> | <pre>акер<br>река</pre> |
| <pre>Я</pre> | <pre>Я<br>Я</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8c310eff0b9f24e7','lists-in-loops',NULL,NULL,'Измени список оценок.','code','**Задача.** Используй список оценок и цикл из примера:

```python
scores = [5, 3, 5, 4, 2, 5]
count = 0

for score in scores:
    if score == 5:
        count = count + 1

print("Пятёрок:", count)
```

Проверь, что цикл считает пятёрки. Затем замени условие так, чтобы считать оценки меньше `4`.

**Ожидаемый результат.** С исходным условием выводится `Пятёрок: 3`. После замены условия выводится количество оценок меньше `4`: `2`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5eb2711bc83cfc3c','lists-in-loops',NULL,NULL,'Создай таблицу 3 × 3, измени только центральную клетку на 1.','code','**Задача.** Создай таблицу 3 × 3, измени только центральную клетку на 1. Объясни, почему изменение не затронуло другие строки.

Списковое включение создаёт готовый список. С выражениями-генераторами в круглых скобках познакомишься в [дополнительном уроке об итераторах](https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/04_iterators/lesson_iterators_generators.ipynb).

**Ожидаемый результат.** Получена таблица `[[0, 0, 0], [0, 1, 0], [0, 0, 0]]`; изменена только центральная клетка, остальные строки независимы.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-edabd46f0ac023c3','lists-in-loops',NULL,NULL,'Задание 1. Выводим элементы','code','**Задача.** Создай список из пяти любимых фильмов, книг или игр. С помощью `for` выведи каждый элемент на отдельной строке. Добавь шестой элемент и проверь, нужно ли менять цикл.

**Ожидаемый результат.** Каждый элемент списка выводится на отдельной строке; после добавления шестого элемента цикл выводит и его без изменения кода цикла.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-03fa41ee00163494','lists-in-loops',NULL,NULL,'Задание 2. Числа больше десяти','code','**Задача.** Дан список `[4, 15, 8, 23, 10, 17]`. С помощью `for` и `if` выведи числа больше `10`. Измени границу и сравни результат.

**Ожидаемый результат.** Для исходной границы выведены `15`, `23` и `17` — по одному числу на строке. После изменения границы вывод отражает новое условие.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8c17c8a1005a1091','lists-in-loops',NULL,NULL,'Задание 3. Изменяем значения','code','**Задача.** Дан список `[3, 6, 9, 12]`. Перебери его по индексам и замени каждый элемент числом, увеличенным в три раза. Выведи список после цикла.

**Ожидаемый результат.** После цикла список равен `[9, 18, 27, 36]`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9b7bb868d4530ea9','lists-in-loops',NULL,NULL,'Задание 4. Перебираем список через `while`','code','**Задача.** Создай список из четырёх городов. Начни с `index = 0`, пока индекс меньше длины списка печатай элемент и увеличивай индекс. Проверь, что цикл завершится.

**Ожидаемый результат.** Каждый из четырёх выбранных городов выведен один раз; цикл завершается после последнего элемента.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-73acfa5fb0f2f6bf','lists-in-loops',NULL,NULL,'Посылки для робота · обязательная','code','**Сюжет.** Подъёмник принимает только посылки легче 5 кг.

**Задача.** Соберите новый список подходящих масс, сохранив порядок, и выведите его длину и содержимое.

**Формат данных.** Сначала n, затем n целых масс по одной на строку.

**Ожидаемый результат.** Количество, затем список Python на следующей строке. Исходные данные не меняйте.

**Ограничения.** 0 ≤ n ≤ 100; 0 ≤ масса ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>5<br>2<br>5<br>1<br>8<br>4</pre> | <pre>3<br>[2, 1, 4]</pre> |
| <pre>0</pre> | <pre>0<br>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c3fabdea2267afaa','lists-in-loops',NULL,NULL,'Длинные названия · обязательная','code','**Сюжет.** Для широких этикеток подходят названия длиннее четырёх символов.

**Задача.** Получите n названий и выведите подходящие в порядке ввода.

**Формат данных.** n, затем n строк.

**Ожидаемый результат.** По названию на строке; при отсутствии совпадений вывод пустой.

**Ограничения.** 0 ≤ n ≤ 20; длина названия от 1 до 30.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>дом<br>компас<br>река</pre> | <pre>компас</pre> |
| <pre>1<br>река</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0cdecce729b4a173','lists-in-loops',NULL,NULL,'План обхода · обязательная','code','**Сюжет.** Робот читает список дел от начала к концу.

**Задача.** Получите дела и выведите каждое через while со счётчиком индекса.

**Формат данных.** n, затем n непустых строк.

**Ожидаемый результат.** Дела по одному на строке.

**Ограничения.** 0 ≤ n ≤ 20; до 40 символов на дело.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>зарядка<br>осмотр</pre> | <pre>зарядка<br>осмотр</pre> |
| <pre>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2ee252cf4043c85a','lists-in-loops',NULL,NULL,'Обратная выгрузка · повторение','code','**Сюжет.** Грузы снимают с ленты с конца.

**Задача.** Получите числа и выведите их от последнего к первому через while.

**Формат данных.** n, затем n целых чисел по одному на строку.

**Ожидаемый результат.** По числу на строке; при n=0 вывод пустой.

**Ограничения.** 0 ≤ n ≤ 20; −100 ≤ число ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>10<br>20<br>30</pre> | <pre>30<br>20<br>10</pre> |
| <pre>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-578e851906d9c27b','lists-in-loops',NULL,NULL,'Поправка термометра · по выбору','code','**Сюжет.** Каждый датчик занижает температуру на два градуса.

**Задача.** Создайте новый список, увеличив каждое измерение на 2, и сохраните исходный. Первый вариант решите через for/append, затем запишите равнозначное списковое включение.

**Формат данных.** n, затем n целых температур.

**Ожидаемый результат.** Две строки: исправленный список Python и исходный список.

**Ограничения.** 0 ≤ n ≤ 20; −100 ≤ температура ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>-2<br>0<br>5</pre> | <pre>[0, 2, 7]<br>[-2, 0, 5]</pre> |
| <pre>0</pre> | <pre>[]<br>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9502708bd7020ad5','lists-in-loops',NULL,NULL,'Подсчёт премий · по выбору','code','**Сюжет.** Премию дают за результаты, кратные трём.

**Задача.** Посчитайте подходящие элементы списка, включая повторные значения и ноль.

**Формат данных.** n, затем n целых чисел.

**Ожидаемый результат.** Одно целое количество.

**Ограничения.** 0 ≤ n ≤ 100; −100 ≤ число ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>3<br>4<br>0<br>9</pre> | <pre>3</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-94e0ba9655c7533d','lists-in-loops',NULL,NULL,'Подписи к плакатам · по выбору','code','**Сюжет.** Дизайнер добавляет восклицательный знак к каждой подписи.

**Задача.** Постройте новый список подписей с добавленным знаком !; исходный список сохраните. Сделайте обычный и сокращённый варианты.

**Формат данных.** n, затем n строк, возможно пустых.

**Ожидаемый результат.** Новый список Python и исходный на разных строках.

**Ограничения.** 0 ≤ n ≤ 20; до 30 символов в строке.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>Ура<br></pre> | <pre>[''Ура!'', ''!'']<br>[''Ура'', '''']</pre> |
| <pre>0</pre> | <pre>[]<br>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-15c8665856823b0c','lists-in-loops',NULL,NULL,'Подходящие оценки · по выбору','code','**Сюжет.** Для витрины достижений нужны оценки 4 и 5.

**Задача.** Из введённого списка оставьте только 4 и 5. Сохраните порядок и повторы.

**Формат данных.** n, затем n оценок.

**Ожидаемый результат.** Список Python.

**Ограничения.** 0 ≤ n ≤ 100; каждая оценка от 2 до 5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>3<br>5<br>4<br>2</pre> | <pre>[5, 4]</pre> |
| <pre>2<br>2<br>3</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2dbea7a199fe4ad0','lists-in-loops',NULL,NULL,'Крупные расходы · по выбору','code','**Сюжет.** Бухгалтеру нужна сумма только расходов строго больше 500 рублей.

**Задача.** Найдите эту сумму, не меняя список.

**Формат данных.** n, затем n целых расходов.

**Ожидаемый результат.** Одно целое число.

**Ограничения.** 0 ≤ n ≤ 100; 0 ≤ расход ≤ 10000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>500<br>501<br>700</pre> | <pre>1201</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-76997beeae56cb9f','lists-in-loops',NULL,NULL,'Изменение ресурсов · по выбору','code','**Сюжет.** Положительные запасы удваиваются, нулевые и отрицательные остаются как есть.

**Задача.** Создайте новый список по этому правилу. Первое решение напишите обычным циклом и условием; затем попробуйте включение с if/else.

**Формат данных.** n, затем n целых чисел.

**Ожидаемый результат.** Новый список Python.

**Ограничения.** 0 ≤ n ≤ 100; −100 ≤ число ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>3<br>-2<br>0<br>7</pre> | <pre>[6, -2, 0, 14]</pre> |
| <pre>0</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5c08cfa31e8f25ed','lists-in-loops',NULL,NULL,'Ответы на приглашение · по выбору','code','**Сюжет.** Организатор получил ответы «да», «нет» или «не знаю».

**Задача.** Посчитайте ответы «да» и создайте новый список без ответов «нет».

**Формат данных.** n, затем n ответов по одному на строку.

**Ожидаемый результат.** Количество согласий, затем список оставшихся ответов Python.

**Ограничения.** 0 ≤ n ≤ 30; ответы только из трёх указанных вариантов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>да<br>нет<br>да<br>не знаю</pre> | <pre>2<br>[''да'', ''да'', ''не знаю'']</pre> |
| <pre>1<br>нет</pre> | <pre>0<br>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a7ecc49e7e8047e1','string-methods',NULL,NULL,'Приветствие с очищенным именем','code','**Задача.** Убери пробелы вокруг имени, а затем выведи приветствие с этим именем.

**Ожидаемый результат.** Выведено приветствие с именем без пробелов по краям.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fc0c9cd0009a851f','string-methods',NULL,NULL,'Исправь название города, заменив Питер на Санкт-Петербург.','code','**Задача.** Исправь название города, заменив `Питер` на `Санкт-Петербург`.

**Ожидаемый результат.** В обновлённой строке название `Питер` заменено на `Санкт-Петербург`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-948d3a3159e4cffc','string-methods',NULL,NULL,'Раздели строку по запятым, а затем собери список обратно, поставив между элементами " / ".','code','**Задача.** Раздели строку по запятым, а затем собери список обратно, поставив между элементами `" / "`.

**Ожидаемый результат.** Строка разделена на элементы по запятым, а затем элементы собраны в одну строку с разделителем ` / `.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cb9f22a378413b51','string-methods',NULL,NULL,'Практика: аккуратная анкета','code','**Задача.** Сделай небольшую программу:

1. Попроси пользователя ввести имя и город.
2. Убери пробелы по краям с помощью `strip()`.
3. Сделай имя с заглавной буквы с помощью `title()`.
4. Выведи сообщение: `Привет, <имя>! Ты живёшь в городе <город>.`

**Ожидаемый результат.** Выведено сообщение `Привет, <имя>! Ты живёшь в городе <город>.`: имя без краевых пробелов приведено к форме `title()`, у города убраны краевые пробелы.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0ff327c922bbd6d6','string-methods',NULL,NULL,'Две этикетки · обязательная','code','**Сюжет.** На упаковку печатают крупную и обычную подпись.

**Задача.** Получите строку, выведите её в верхнем, затем в нижнем регистре.

**Формат данных.** Одна строка.

**Ожидаемый результат.** Две строки в указанном порядке.

**Ограничения.** До 80 символов; строка может быть пустой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>PyThOn</pre> | <pre>PYTHON<br>python</pre> |
| <pre>Кот</pre> | <pre>КОТ<br>кот</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9ffa501ca6c50c70','string-methods',NULL,NULL,'Счётчик букв · обязательная','code','**Сюжет.** Редактор считает строчную кириллическую букву «а» в сообщении.

**Задача.** Выведите число вхождений именно символа «а»; заглавная «А» не учитывается.

**Формат данных.** Одна строка.

**Ожидаемый результат.** Одно целое число.

**Ограничения.** До 100 символов; пустая строка допустима.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Аня и мама</pre> | <pre>2</pre> |
| <em>Пустая строка (Enter)</em> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2d2ca52ee34cfbb5','string-methods',NULL,NULL,'Проверка вложения · обязательная','code','**Сюжет.** Каталог принимает изображения с суффиксом .png.

**Задача.** Проверьте, заканчивается ли имя файла на .png без учёта регистра.

**Формат данных.** Одна непустая строка — имя файла.

**Ожидаемый результат.** YES при совпадении, иначе NO.

**Ограничения.** До 80 символов; пробелов по краям нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Map.PNG</pre> | <pre>YES</pre> |
| <pre>map.png.txt</pre> | <pre>NO</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-df04ce626ba60b60','string-methods',NULL,NULL,'Сообщение афиши · повторение','code','**Сюжет.** Для афиши нужно убрать пробелы по краям и заменить точки на восклицательные знаки.

**Задача.** Выполните оба преобразования, внутренние пробелы сохраните.

**Формат данных.** Одна строка.

**Ожидаемый результат.** Одна обработанная строка, возможно пустая.

**Ограничения.** До 100 символов; может состоять только из пробелов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>  Ждём. Сегодня.  </pre> | <pre>Ждём! Сегодня!</pre> |
| <pre>   </pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-63d311bfba47f06e','string-methods',NULL,NULL,'Имена в списке · по выбору','code','**Сюжет.** Сервис получает имена, разделённые любым числом пробелов.

**Задача.** Разделите строку на слова и выведите каждое слово с новой строки.

**Формат данных.** Одна строка.

**Ожидаемый результат.** По слову на строке; для пустой строки вывода нет.

**Ограничения.** До 100 символов; пустая строка допустима.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>  Аня   Миша </pre> | <pre>Аня<br>Миша</pre> |
| <em>Пустая строка (Enter)</em> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a5ebe4c03f1bc7b6','string-methods',NULL,NULL,'Меню через запятую · по выбору','code','**Сюжет.** Повар перечисляет три блюда через запятые.

**Задача.** Разделите ввод, уберите пробелы по краям каждого названия и соедините названия разделителем «; ».

**Формат данных.** Одна строка с ровно двумя запятыми.

**Ожидаемый результат.** Одна строка с тремя очищенными названиями.

**Ограничения.** Три названия непустые после удаления краевых пробелов; запятых внутри названий нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre> суп, чай ,каша </pre> | <pre>суп; чай; каша</pre> |
| <pre>а,б,в</pre> | <pre>а; б; в</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-daead81fbb8081b8','string-methods',NULL,NULL,'Подпись с заглавной буквы · по выбору','code','**Сюжет.** Каталог меняет только первую букву заголовка.

**Задача.** Сделайте первый символ заглавным, остальные оставьте без изменений.

**Формат данных.** Одно непустое слово.

**Ожидаемый результат.** Преобразованное слово.

**Ограничения.** От 1 до 1000 английских букв.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>konjac</pre> | <pre>Konjac</pre> |
| <pre>ApPLe</pre> | <pre>ApPLe</pre> |

**Источник.** Пересказ [Codeforces 281A — Word Capitalization](https://codeforces.com/problemset/problem/281/A). Формат и требование сохранены.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-46deb87867eaa9ee','string-methods',NULL,NULL,'Короткие подписи · по выбору','code','**Сюжет.** Очень длинные слова не помещаются на карточках.

**Задача.** Слова длиной больше 10 замените первой буквой, числом внутренних букв и последней буквой; остальные сохраните.

**Формат данных.** n, затем n слов по одному на строку.

**Ожидаемый результат.** По результату на слово, в том же порядке.

**Ограничения.** 1 ≤ n ≤ 100; слова из 1–100 строчных латинских букв.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>localization<br>word</pre> | <pre>l10n<br>word</pre> |
| <pre>2<br>abcdefghij<br>abcdefghijk</pre> | <pre>abcdefghij<br>a9k</pre> |

**Источник.** Пересказ [Codeforces 71A — Way Too Long Words](https://codeforces.com/problemset/problem/71/A). Ввод и правило порога сохранены; свои примеры.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a2f31b8e03845c12','string-methods',NULL,NULL,'Поиск курса · по выбору','code','**Сюжет.** Поисковик ищет отдельное слово python среди слов запроса.

**Задача.** Посчитайте слова, определите наличие слова python без учёта регистра и соедините исходные слова знаком ★.

**Формат данных.** Одна строка; слова разделены пробельными символами.

**Ожидаемый результат.** Три строки: число слов; YES/NO; слова через ★, с исходным регистром. Для пустого ввода третья строка пустая.

**Ограничения.** До 100 символов; знаков препинания нет; пустая строка допустима.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Я учу PYTHON</pre> | <pre>3<br>YES<br>Я★учу★PYTHON</pre> |
| <pre>pythonic</pre> | <pre>1<br>NO<br>pythonic</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8ae98c73f219c5b0','tuples-dicts-sets',NULL,NULL,'Создай словарь book с ключами "title", "author" и "year".','code','**Задача.** Создай словарь `book` с ключами `"title"`, `"author"` и `"year"`. Выведи название книги и добавь ключ `"pages"`.

План: создай три пары; прочитай название по ключу title; добавь pages; выведи весь словарь и проверь изменения.

**Ожидаемый результат.** Сначала выведено название книги; затем выведен словарь `book` с добавленным ключом `pages`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-62b4d922da2e38e7','tuples-dicts-sets',NULL,NULL,'Посчитай слова в строке "дом лес дом" через split().','code','**Задача.** Посчитай слова в строке `"дом лес дом"` через `split()`. Если нужны только разные слова, выбери `set`; если число повторений — `dict`.

**Ожидаемый результат.** Для строки `"дом лес дом"` получен словарь `{"дом": 2, "лес": 1}`; для пустой строки — `{}`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4f32bf4143a1d9ed','tuples-dicts-sets',NULL,NULL,'Задание 1. Координаты','code','**Задача.** Создай кортеж с координатами `x` и `y`, распакуй его в две переменные и выведи каждую координату.

Для каждого задания выбери коллекцию и объясни выбор, предскажи результат, а затем запускай код. При ошибке проверь скобки, кавычки, двоеточия и отступы.

**Ожидаемый результат.** Координаты выведены отдельно и в том же порядке, что при распаковке: сначала `x`, затем `y`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b5fd08acf1c45c0f','tuples-dicts-sets',NULL,NULL,'Задание 2. Словарь оценок','code','**Задача.** Создай словарь с тремя именами и оценками. Выведи имя и оценку каждого ученика. Измени одну оценку и добавь ещё одного ученика.

**Ожидаемый результат.** Показаны имена и оценки; после изменений в словаре обновлена одна оценка и добавлен четвёртый ученик.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ba3272c3334db57e','tuples-dicts-sets',NULL,NULL,'Задание 3. Уникальные слова','code','**Задача.** Дан список слов с повторами. Получи множество уникальных слов и проверь, есть ли в нём слово `"Python"`.

**Ожидаемый результат.** В множестве каждое слово представлено один раз; показан результат проверки наличия `"Python"`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a55fb74730ed4275','tuples-dicts-sets',NULL,NULL,'Задание 4. Общие увлечения','code','**Задача.** Даны два множества друзей: кто ходит на рисование и кто ходит на шахматы. Выведи:

- тех, кто ходит на оба занятия;
- тех, кто ходит хотя бы на одно;
- тех, кто ходит на рисование, но не на шахматы.

**Ожидаемый результат.** Выведены три множества: общие увлечения, все увлечения вместе и увлечения рисованием без шахмат. Порядок элементов множества не фиксирован.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e102af4658b8064c','tuples-dicts-sets',NULL,NULL,'Полка фильмов · обязательная','code','**Сюжет.** Киноклуб хранит неизменяемую четвёрку названий.

**Задача.** Прочитайте четыре названия, создайте кортеж и выведите первое и последнее.

**Формат данных.** Четыре строки.

**Ожидаемый результат.** Два названия на отдельных строках.

**Ограничения.** Названия непустые, до 80 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>А<br>Б<br>В<br>Г</pre> | <pre>А<br>Г</pre> |
| <pre>Кот<br>Кот<br>Кот<br>Кот</pre> | <pre>Кот<br>Кот</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-68bab1495d1097d6','tuples-dicts-sets',NULL,NULL,'Паспорт питомца · обязательная','code','**Сюжет.** Приют собирает имя, вид и возраст питомца в одной записи.

**Задача.** Создайте словарь с ключами name, species, age и выведите карточку.

**Формат данных.** Три строки: имя, вид, целый возраст.

**Ожидаемый результат.** Строки «Имя: ...», «Вид: ...», «Возраст: ...».

**Ограничения.** Имя/вид непустые до 40 символов; 0 ≤ возраст ≤ 30.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Барсик<br>кот<br>2</pre> | <pre>Имя: Барсик<br>Вид: кот<br>Возраст: 2</pre> |
| <pre>Луч<br>пёс<br>0</pre> | <pre>Имя: Луч<br>Вид: пёс<br>Возраст: 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7815eb6b12db950c','tuples-dicts-sets',NULL,NULL,'Уникальные жетоны · обязательная','code','**Сюжет.** Сканер несколько раз считывает одни и те же номера.

**Задача.** Посчитайте число различных номеров.

**Формат данных.** n, затем n целых чисел по одному на строку.

**Ожидаемый результат.** Одно целое количество.

**Ограничения.** 0 ≤ n ≤ 100; 0 ≤ номер ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>3<br>3<br>1<br>3</pre> | <pre>2</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1ba9bef93480388c','tuples-dicts-sets',NULL,NULL,'Список гостей · повторение','code','**Сюжет.** Организатор получил имена через запятые, некоторые повторяются.

**Задача.** Уберите пробелы по краям имён, исключите повторы и выведите число разных гостей. Регистр важен.

**Формат данных.** Одна строка, либо пустая, либо список непустых имён через запятую.

**Ожидаемый результат.** Одно целое количество.

**Ограничения.** До 50 имён, до 30 символов в имени; пустых элементов в непустом списке нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Аня, Миша,Аня</pre> | <pre>2</pre> |
| <em>Пустая строка (Enter)</em> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-46e347b9776f5e0c','tuples-dicts-sets',NULL,NULL,'Покупки команды · по выбору','code','**Сюжет.** Записи о товаре могут повторяться.

**Задача.** Сложите количества одинаковых товаров в словаре. Выведите товары в порядке первого появления.

**Формат данных.** n, затем для каждой записи две строки: название, количество.

**Ожидаемый результат.** По записи «название количество» на строке; при n=0 вывод пустой.

**Ограничения.** 0 ≤ n ≤ 50; название непустое до 30 символов; 0 ≤ количество ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>чай<br>2<br>сок<br>1<br>чай<br>3</pre> | <pre>чай 5<br>сок 1</pre> |
| <pre>0</pre> | <em>Нет вывода</em> |

**Пояснение.** Повторный товар увеличивает количество, но не создаёт новую строку. Для порядка можно хранить отдельный список новых названий.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-50c7a67dff112c44','tuples-dicts-sets',NULL,NULL,'Читательские встречи · по выбору','code','**Сюжет.** Два друга отмечают номера прочитанных книг.

**Задача.** Выведите число общих книг и число книг, прочитанных только первым другом. Повторы в одном списке не считаются.

**Формат данных.** n, затем n номеров первого друга; затем m и m номеров второго. Все значения на отдельных строках.

**Ожидаемый результат.** Два целых числа через пробел: общие, только у первого.

**Ограничения.** 0 ≤ n,m ≤ 50; номера от 1 до 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>1<br>2<br>2<br>2<br>2<br>3</pre> | <pre>1 1</pre> |
| <pre>0<br>0</pre> | <pre>0 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c856d7bbad64833b','tuples-dicts-sets',NULL,NULL,'Сигналы станции · по выбору','code','**Сюжет.** Станция записывает слова с названиями сигналов.

**Задача.** Без учёта регистра посчитайте частоты слов. Выведите пары в порядке первого появления.

**Формат данных.** Одна строка слов, разделённых пробелами.

**Ожидаемый результат.** По строке «слово количество», слова в нижнем регистре; пустой ввод даёт пустой вывод.

**Ограничения.** До 100 слов из английских букв; пустая строка допустима.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Radar lidar RADAR</pre> | <pre>radar 2<br>lidar 1</pre> |
| <em>Пустая строка (Enter)</em> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c7f6254e2fba5994','tuples-dicts-sets',NULL,NULL,'Алфавит сообщения · по выбору','code','**Сюжет.** Радиооператор считает символы в кодовом слове.

**Задача.** Постройте частоты букв и выведите буквы в порядке первого появления.

**Формат данных.** Одна строка.

**Ожидаемый результат.** По строке «буква количество»; при пустом слове вывод пустой.

**Ограничения.** От 0 до 30 строчных латинских букв.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>banana</pre> | <pre>b 1<br>a 3<br>n 2</pre> |
| <em>Пустая строка (Enter)</em> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-38a9047924c585d7','records-practice',NULL,NULL,'Поиск участника · обязательная','code','**Сюжет.** Организатору нужно быстро проверить, записан ли участник на кружок.

**Задача.** Напиши функцию `find_student(students, student_id)`. Она возвращает словарь записи с таким `id`. Если участника нет, функция возвращает `None`. Не изменяй исходный список.

**Формат данных.** Список словарей с целочисленными `id` и строковыми `name`; искомый целый `student_id`.

**Ожидаемый результат.** Словарь найденной записи либо `None`.

**Ограничения.** `id` уникален; список содержит от 0 до 100 записей.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>find_student([{''id'': 4, ''name'': ''Лея''}, {''id'': 8, ''name'': ''Рэй''}], 8)</pre> | <pre>{''id'': 8, ''name'': ''Рэй''}</pre> |
| <pre>find_student([], 3)</pre> | <pre>None</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f98bf8a427fd6275','records-practice',NULL,NULL,'Пересчёт оценок · обязательная','code','**Сюжет.** Учитель исправляет оценку в журнале по номеру ученика.

**Задача.** Напиши `update_score(students, student_id, new_score)`. Если запись найдена, замени её `score` и верни `True`. Если нет — верни `False`. Изменение должно быть видно в исходном списке.

**Формат данных.** Список словарей `{id, score}`, целые `student_id` и `new_score`.

**Ожидаемый результат.** `True`, если запись изменена; иначе `False`.

**Ограничения.** `id` уникален; `0 ≤ new_score ≤ 100`.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>students = [{''id'': 2, ''score'': 70}]<br>update_score(students, 2, 90)<br>students</pre> | <pre>True<br>[{''id'': 2, ''score'': 90}]</pre> |
| <pre>update_score([], 5, 60)</pre> | <pre>False</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-acc724def5c260c1','records-practice',NULL,NULL,'Корзина покупок · обязательная','code','**Сюжет.** Магазину нужен итог по товарам, которые покупатель добавил в корзину.

**Задача.** Напиши функцию `cart_total(cart)`, которая возвращает сумму `price * quantity` для каждой записи корзины. Если корзина пуста, верни 0.

**Формат данных.** Список словарей с целыми полями `price` и `quantity`.

**Ожидаемый результат.** Целое число — общая стоимость.

**Ограничения.** От 0 до 50 товаров; цена и количество неотрицательны.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>cart_total([{''price'': 30, ''quantity'': 2}, {''price'': 15, ''quantity'': 1}])</pre> | <pre>75</pre> |
| <pre>cart_total([])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6c3a663ff496993e','records-practice',NULL,NULL,'Любимые жанры · повторение','code','**Сюжет.** Библиотекарь выясняет, сколько книг относится к выбранному жанру.

**Задача.** Напиши `count_genre(library, genre)`. `library` — словарь с ключом `books`, значение которого — список записей. У каждой записи есть список строк `genres`. Верни количество книг, в которых жанр встречается хотя бы один раз.

**Формат данных.** Словарь `library` со списком словарей в `books`; строка `genre`.

**Ожидаемый результат.** Неотрицательное целое количество книг.

**Ограничения.** В одной записи жанр не повторяется; поле `books` всегда есть.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>count_genre({''books'': [{''genres'': [''сказка'', ''драма'']}, {''genres'': [''драма'']}]}, ''драма'')</pre> | <pre>2</pre> |
| <pre>count_genre({''books'': []}, ''драма'')</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bb02a15fb6abaf12','iterators-generators',NULL,NULL,'Очередь результатов · обязательная','code','**Сюжет.** Прибор выдаёт квадраты по запросу и не начинает очередь заново.

**Задача.** Создайте генератор квадратов чисел 1…n; получите первый элемент через next с запасным значением None. Выведите первый результат, остаток списком и результат повторного list на том же генераторе.

**Формат данных.** Аргумент n для функции consume_squares(n), которая возвращает кортеж из трёх результатов. input не требуется.

**Ожидаемый результат.** Возвращаемое значение: (первый элемент или None, список остатка, пустой список).

**Ограничения.** 0 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>consume_squares(3)</pre> | <pre>(1, [4, 9], [])</pre> |
| <pre>consume_squares(0)</pre> | <pre>(None, [], [])</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-31975a3676b82da2','iterators-generators',NULL,NULL,'Два подсчёта · обязательная','code','**Сюжет.** Аналитик дважды запрашивает сумму одной и той же очереди квадратов.

**Задача.** Функция square_sums(n) создаёт один генератор 1²…n² и возвращает сумму первого и второго проходов по нему.

**Формат данных.** Целый аргумент n; без input.

**Ожидаемый результат.** Кортеж (первая сумма, вторая сумма).

**Ограничения.** 0 ≤ n ≤ 20.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>square_sums(4)</pre> | <pre>(30, 0)</pre> |
| <pre>square_sums(0)</pre> | <pre>(0, 0)</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e21977a0bb048934','iterators-generators',NULL,NULL,'Оценки напротив имён · обязательная','code','**Сюжет.** Сервис соединяет имена и оценки по порядку.

**Задача.** pair_scores(names, scores) возвращает list(zip(names, scores)). Если длины различаются, верните также текст «Неполные данные», иначе «Полные данные».

**Формат данных.** Два списка аргументов; элементы names — строки, scores — целые числа.

**Ожидаемый результат.** Кортеж из списка пар и строки статуса. В этой задаче сокращение zip намеренно допускается.

**Ограничения.** До 10 элементов в каждом списке; имена непустые.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>pair_scores([''Аня'', ''Борис''], [5])</pre> | <pre>([(''Аня'', 5)], ''Неполные данные'')</pre> |
| <pre>pair_scores([], [])</pre> | <pre>([], ''Полные данные'')</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-099a177c302fd9c3','iterators-generators',NULL,NULL,'Допуск оценок · повторение','code','**Сюжет.** Электронный журнал принимает непустую последовательность оценок от 2 до 5.

**Задача.** Функция valid_scores(scores) возвращает True, только если список непустой и все значения в диапазоне.

**Формат данных.** Список целых чисел — аргумент функции.

**Ожидаемый результат.** Логическое возвращаемое значение.

**Ограничения.** До 30 элементов; числа от −10 до 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>valid_scores([2, 5])</pre> | <pre>True</pre> |
| <pre>valid_scores([])</pre> | <pre>False</pre> |
| <pre>valid_scores([1, 5])</pre> | <pre>False</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0f79f8f8589132be','text-bytes-utf8',NULL,NULL,'Закодируй фразу с именем ученика в UTF-8, выведи длину строки и байтов, затем восстанови строку через decode.','code','**Задача.** Закодируй фразу с именем ученика в UTF-8, выведи длину строки и байтов, затем восстанови строку через decode. Сверь, что восстановленный текст совпадает с исходным. Отдельно проверь байты ASCII-строки и кириллической строки.

**Ожидаемый результат.** Выведены длины исходной строки и её UTF-8-представления в байтах; после `decode()` восстановлен исходный текст. Для ASCII- и кириллической строк длины байтов сопоставлены отдельно.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d8f3fad7894f1efd','text-bytes-utf8',NULL,NULL,'Письмо, которое потерялось · обязательная','code','**Сюжет.** Робот получил текстовое сообщение как байты и должен показать его человеку.

**Задача.** Функция restore_message(data) декодирует байты data как UTF-8 и возвращает строку. Если данные некорректны, функция должна позволить возникнуть UnicodeDecodeError, не заменяя байты молча.

**Формат данных.** Один объект bytes, содержащий корректный UTF-8.

**Ожидаемый результат.** Строка типа str с восстановленным текстом.

**Ограничения.** В основном тесте передаются корректные UTF-8-байты. Отдельно проверь некорректные байты и запиши имя возникшего исключения.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>restore_message("Привет".encode("utf-8"))</pre> | <pre>Привет</pre> |
| <pre>restore_message(b"Python")</pre> | <pre>Python</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9923462c16c80015','text-bytes-utf8',NULL,NULL,'Размер послания · обязательная','code','**Сюжет.** Почтовый робот должен узнать, сколько места займёт текстовое сообщение при отправке.

**Задача.** Напиши функцию `utf8_size(text)`, которая возвращает число байтов в строке при кодировании UTF-8. Исходную строку не меняй.

**Формат данных.** Один аргумент `text`: строка Python.

**Ожидаемый результат.** Целое число байтов UTF-8.

**Ограничения.** Длина строки — от 0 до 100 символов; разрешены латинские и кириллические буквы, пробелы и цифры.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>utf8_size("Aя")</pre> | <pre>3</pre> |
| <pre>utf8_size("")</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9965d84ed57ee85a','text-bytes-utf8',NULL,NULL,'Повреждённая записка · обязательная','code','**Сюжет.** Архивариус получает байты из старого устройства. Иногда текст повреждён, и программа должна сообщить об этом без аварийного завершения.

**Задача.** Напиши функцию `safe_decode(data)`. Для корректного UTF-8 верни кортеж `(True, текст)`. Если возникает `UnicodeDecodeError`, верни `(False, "")`. Другие ошибки не перехватывай.

**Формат данных.** Один аргумент `data`: объект `bytes`.

**Ожидаемый результат.** Кортеж из логического значения и строки; для некорректных байтов — `(False, "")`.

**Ограничения.** Длина данных — до 1000 байтов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>safe_decode("Привет".encode("utf-8"))</pre> | <pre>(True, ''Привет'')</pre> |
| <pre>safe_decode(bytes([255]))</pre> | <pre>(False, '''')</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8aa0f4094e1d3880','text-bytes-utf8',NULL,NULL,'Архив коротких сообщений · повторение','code','**Сюжет.** Робот передаёт несколько коротких сообщений одним байтовым блоком и затем восстанавливает их.

**Задача.** Напиши функцию `pack_messages(messages)`, которая объединяет непустые строки одним символом перевода строки и кодирует результат в UTF-8. Пустые строки в списке пропускаются. Функция возвращает `bytes`; исходный список не меняет.

**Формат данных.** Один аргумент `messages`: список строк.

**Ожидаемый результат.** Один объект `bytes`, содержащий оставшиеся сообщения через перевод строки в UTF-8.

**Ограничения.** От 0 до 100 строк; каждая строка не содержит переводов строки.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>pack_messages(["Привет", "", "Python"])</pre> | <pre>b''Привет\nPython''</pre> |
| <pre>pack_messages([])</pre> | <pre>b''''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5fb04f1040f3db45','functions-modules',NULL,NULL,'Добавь в show_menu() ещё один пункт.','code','**Задача.** Добавь в `show_menu()` ещё один пункт. Вызови функцию второй раз в конце ячейки.

**Ожидаемый результат.** В обоих вызовах `show_menu()` напечатано меню с добавленным пунктом.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-14b22c94ed334f52','functions-modules',NULL,NULL,'Создай функцию show_difference(first, second), которая печатает разность first - second.','code','**Задача.** Создай функцию `show_difference(first, second)`, которая печатает разность `first - second`. Проверь на двух парах чисел.

**Ожидаемый результат.** Для каждой из двух проверенных пар напечатана разность `first - second`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5cf405d4fe72d614','functions-modules',NULL,NULL,'Напиши multiply(first, second), которая возвращает произведение.','code','**Задача.** Напиши `multiply(first, second)`, которая возвращает произведение. Сохрани результат в переменную и выведи сообщение с f-строкой.

**Ожидаемый результат.** Функция возвращает произведение аргументов; оно сохранено в переменной и показано в сообщении с f-строкой.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-53bd103214a30647','functions-modules',NULL,NULL,'Напиши count_even(numbers), которая возвращает число чётных элементов и ничего не печатает.','code','**Задача.** Напиши `count_even(numbers)`, которая возвращает число чётных элементов и ничего не печатает. Вывод добавь отдельно, после вызова функции.

**Ожидаемый результат.** `count_even([1, 2, 4])` возвращает `2`, а `count_even([])` — `0`; сама функция ничего не печатает.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c2ce8432354dcd3a','functions-modules',NULL,NULL,'Добавь ветку elif, чтобы отдельно описать возраст 13 лет.','code','**Задача.** Добавь ветку `elif`, чтобы отдельно описать возраст 13 лет. Выбери порядок условий так, чтобы каждое значение попадало в нужную ветку.

**Ожидаемый результат.** Возраст `13` попадает в отдельную ветку `elif`; остальные значения продолжают попадать в предусмотренные для них ветки.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dacc81f60cb7782d','functions-modules',NULL,NULL,'Измени список и проверь подсчёт.','code','**Задача.** Измени список и проверь подсчёт. Измени условие так, чтобы считать оценки меньше четырёх.

**Ожидаемый результат.** После изменения списка посчитаны оценки меньше четырёх; условие подсчёта соответствует именно этой границе.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fba4b9ece58a1099','functions-modules',NULL,NULL,'Измени условие на number % 2 == 0, чтобы функция собирала чётные числа.','code','**Задача.** Измени условие на `number % 2 == 0`, чтобы функция собирала чётные числа. Для нуля это условие тоже верно.

**Ожидаемый результат.** Функция собирает значения, для которых `number % 2 == 0`; ноль также попадает в результат.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5f00e683c0e07786','functions-modules',NULL,NULL,'Добавь ученика в список и ещё одно слово.','code','**Задача.** Добавь ученика в список и ещё одно слово. Поменяй минимальную длину в вызове `count_long_words()`.

**Ожидаемый результат.** Новый ученик также выводится в списке приветствий; `count_long_words()` пересчитан по обновлённому списку слов с новым значением минимальной длины.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-3a190d127f954a1a','functions-modules',NULL,NULL,'Задание 1. Приветствие','code','**Задача.** Создай функцию `welcome()`, которая печатает две строки: приветствие и напоминание повторить код. Вызови её два раза.

**Ожидаемый результат.** Каждый вызов `welcome()` печатает две строки: приветствие и напоминание повторить код.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9c889f322a95efe2','functions-modules',NULL,NULL,'Задание 2. Прямоугольник из символов','code','**Задача.** Создай функцию с параметрами `symbol` и `count`. Она должна напечатать символ `count` раз. Используй цикл `for` или умножение строки на число.

**Ожидаемый результат.** Функция печатает символ ровно `count` раз; результат можно получить циклом или умножением строки.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4a6818352f179176','functions-modules',NULL,NULL,'Задание 3. Больше ли число?','code','**Задача.** Создай функцию `is_bigger(number, border)`, которая возвращает `True`, если число больше границы, и `False` в противном случае. Используй её результат в `if`.

**Ожидаемый результат.** Функция возвращает `True`, только если `number > border`, иначе `False`; результат используется в ветвлении `if`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-515f971dead5a4d3','functions-modules',NULL,NULL,'Задание 4. Сумма списка','code','**Задача.** Напиши функцию, которая принимает список чисел и возвращает их сумму. Не используй `sum()`: заведи переменную-сумму и сложи элементы циклом `for`.

**Ожидаемый результат.** Функция возвращает сумму всех чисел списка, вычисленную циклом `for` без вызова `sum()`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-22bc1c4d86d8d366','functions-modules',NULL,NULL,'Задание 5. Перенеси функции в модуль','code','**Задача.** Создай в `student_tools.py` любые две функции из заданий 1–4 этого же урока. Импортируй их в ноутбук и проверь на новых значениях.

**Ожидаемый результат.** Обе выбранные функции находятся в `student_tools.py`, импортированы в ноутбук и успешно проверены на новых значениях.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-11b6b3cd7fc7b4ba','functions-modules',NULL,NULL,'Заставка клуба · обязательная','code','**Сюжет.** Терминал клуба показывает неизменную заставку.

**Задача.** Напишите show_title() без параметров: она печатает «Клуб исследователей». Вызовите дважды.

**Формат данных.** Два последовательных вызова show_title(); input не нужен.

**Ожидаемый результат.** Каждый вызов печатает одну строку.

**Ограничения.** Функция не принимает аргументы и возвращает None.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>show_title(); show_title()</pre> | <pre>Клуб исследователей<br>Клуб исследователей</pre> |
| <pre>show_title()</pre> | <pre>Клуб исследователей</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b1571abfe82cef85','functions-modules',NULL,NULL,'Меню терминала · обязательная','code','**Сюжет.** Посетитель выбирает действие по текстовому меню.

**Задача.** show_menu() печатает три строки: «1. Каталог», «2. Помощь», «3. Выход».

**Формат данных.** Вызов функции без аргументов.

**Ожидаемый результат.** Три строки текста.

**Ограничения.** Меню не спрашивает выбор и не запускает другие действия.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>show_menu()</pre> | <pre>1. Каталог<br>2. Помощь<br>3. Выход</pre> |
| <pre>Повторный show_menu()</pre> | <pre>1. Каталог<br>2. Помощь<br>3. Выход</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ce88c04ad5c7c86b','functions-modules',NULL,NULL,'Приветствие участника · обязательная','code','**Сюжет.** Организатор готовит персональное приветствие.

**Задача.** greet(name) возвращает строку «Привет, ИМЯ!», не печатая её.

**Формат данных.** Аргумент name — непустая строка.

**Ожидаемый результат.** Возвращаемая строка.

**Ограничения.** От 1 до 40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>greet(''Аня'')</pre> | <pre>''Привет, Аня!''</pre> |
| <pre>greet(''Ян'')</pre> | <pre>''Привет, Ян!''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4b8f850e96221277','functions-modules',NULL,NULL,'Экран из звёзд · повторение','code','**Сюжет.** На табло нужна прямоугольная заставка.

**Задача.** show_rectangle(width, height) печатает прямоугольник из *. Используйте вложенные циклы.

**Формат данных.** Два целых аргумента: ширина и высота.

**Ожидаемый результат.** height строк шириной width. При нулевой высоте вывод пустой; при нулевой ширине строки пустые.

**Ограничения.** 0 ≤ width,height ≤ 10; тему вложенных циклов нужно пройти до этой задачи.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>show_rectangle(3, 2)</pre> | <pre>***<br>***</pre> |
| <pre>show_rectangle(3, 0)</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bccacb2bdc26e0c6','functions-modules',NULL,NULL,'Карточка занятия · по выбору','code','**Сюжет.** Учебный сервис собирает имя ученика и предмет.

**Задача.** lesson_card(name, subject) возвращает строку «ИМЯ изучает ПРЕДМЕТ».

**Формат данных.** Две непустые строки-аргумента.

**Ожидаемый результат.** Возвращаемая строка.

**Ограничения.** До 40 символов в каждой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>lesson_card(''Миша'', ''Python'')</pre> | <pre>''Миша изучает Python''</pre> |
| <pre>lesson_card(''Аня'', ''математику'')</pre> | <pre>''Аня изучает математику''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-789b60c2d7bc0340','functions-modules',NULL,NULL,'Площадь участка · по выбору','code','**Сюжет.** Квадратный участок описывается длиной стороны.

**Задача.** square(side) возвращает квадрат стороны. Результат вызова используйте в f-строке «Площадь: X» при демонстрации.

**Формат данных.** Целый аргумент side.

**Ожидаемый результат.** Функция возвращает целое число; в таблице приведены возвращаемые значения.

**Ограничения.** 0 ≤ side ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>square(4)</pre> | <pre>16</pre> |
| <pre>square(0)</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-84a4fdddbbcfacc6','functions-modules',NULL,NULL,'Парные наборы · по выбору','code','**Сюжет.** Склад хочет узнать, делится ли число изделий на пары.

**Задача.** is_even(number) возвращает True для чётного целого, иначе False. Ноль считается чётным.

**Формат данных.** Целый аргумент number.

**Ожидаемый результат.** Логическое значение.

**Ограничения.** −1000 ≤ number ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>is_even(-2)</pre> | <pre>True</pre> |
| <pre>is_even(1)</pre> | <pre>False</pre> |
| <pre>is_even(0)</pre> | <pre>True</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e27bf17607a5a665','functions-modules',NULL,NULL,'Фамилия на пропуске · по выбору','code','**Сюжет.** Охрана объединяет имя и фамилию посетителя.

**Задача.** make_full_name(first_name, last_name) возвращает имя, пробел и фамилию.

**Формат данных.** Две непустые строки-аргумента, без пробелов по краям.

**Ожидаемый результат.** Возвращаемая строка.

**Ограничения.** До 40 символов в каждой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>make_full_name(''Аня'', ''Иванова'')</pre> | <pre>''Аня Иванова''</pre> |
| <pre>make_full_name(''Ян'', ''Ли'')</pre> | <pre>''Ян Ли''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-394d1f99f8c40a0f','functions-modules',NULL,NULL,'Режим теплицы · по выбору','code','**Сюжет.** До десяти градусов теплица работает в холодном режиме.

**Задача.** describe_temperature(temp) возвращает «холодно», если температура меньше 10, иначе «тепло».

**Формат данных.** Целый аргумент temp.

**Ожидаемый результат.** Возвращаемая строка.

**Ограничения.** −50 ≤ temp ≤ 50.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>describe_temperature(9)</pre> | <pre>''холодно''</pre> |
| <pre>describe_temperature(10)</pre> | <pre>''тепло''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-708ae40bee73a628','functions-modules',NULL,NULL,'Короткие подписи · по выбору','code','**Сюжет.** На компактную этикетку помещаются слова короче пяти букв.

**Задача.** count_short_words(words) возвращает количество подходящих слов. Пустые строки допустимы и считаются короткими.

**Формат данных.** Список строк — аргумент функции.

**Ожидаемый результат.** Целое число. Исходный список не изменяется.

**Ограничения.** До 50 строк, до 30 символов в каждой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>count_short_words([''кот'', ''компас'', ''''])</pre> | <pre>2</pre> |
| <pre>count_short_words([])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f64b846501481ffb','functions-modules',NULL,NULL,'Выборка номеров · по выбору','code','**Сюжет.** Из списка номеров нужно получить отдельный список чётных.

**Задача.** get_even_numbers(numbers) возвращает новый список чётных значений в исходном порядке; исходный список сохраняется.

**Формат данных.** Список целых чисел.

**Ожидаемый результат.** Новый список, в том числе отдельный пустой при отсутствии элементов.

**Ограничения.** До 100 элементов от −100 до 100; повторы разрешены.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>get_even_numbers([1, 2, 0, -4])</pre> | <pre>[2, 0, -4]</pre> |
| <pre>get_even_numbers([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2bb9230bdc9d9f4f','functions-modules',NULL,NULL,'Лучший результат · по выбору','code','**Сюжет.** Тренер выбирает самый высокий результат команды, в том числе при отрицательных значениях.

**Задача.** best_result(numbers) возвращает максимум непустого списка. Используйте цикл и сравнения без max.

**Формат данных.** Непустой список целых чисел.

**Ожидаемый результат.** Одно возвращаемое целое число.

**Ограничения.** 1–100 элементов от −1000 до 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>best_result([-5, -2, -9])</pre> | <pre>-2</pre> |
| <pre>best_result([7])</pre> | <pre>7</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a24417d5bccbbbb0','functions-modules',NULL,NULL,'Список на букву а · по выбору','code','**Сюжет.** Указатель выбирает названия, начинающиеся со строчной кириллической «а».

**Задача.** starts_with_a(words) возвращает новый список подходящих строк. Пустая строка не подходит; регистр важен.

**Формат данных.** Список строк.

**Ожидаемый результат.** Список строк в исходном порядке.

**Ограничения.** До 30 строк длиной 0–40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>starts_with_a([''арбуз'', '''', ''Атлас'', ''апельсин''])</pre> | <pre>[''арбуз'', ''апельсин'']</pre> |
| <pre>starts_with_a([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-050a48ae366d8cd1','functions-modules',NULL,NULL,'Отчёт в модуле · по выбору','code','**Сюжет.** Журнал повторно использует одну функцию в разных программах.

**Задача.** Создайте student_report.py с make_report(name, scores), возвращающей три строки: имя, количество оценок, число пятёрок. Импортируйте её в ячейке блокнота; модуль при импорте не должен печатать текст.

**Формат данных.** Имя и список оценок — аргументы функции; модуль лежит рядом с рабочим блокнотом.

**Ожидаемый результат.** Возвращаемая строка без перевода строки в конце. В таблице показан её текст, а не repr.

**Ограничения.** Имя непустое; до 30 целых оценок от 2 до 5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>make_report(''Аня'', [5, 4, 5])</pre> | <pre>Имя: Аня<br>Оценок: 3<br>Пятёрок: 2</pre> |
| <pre>make_report(''Миша'', [])</pre> | <pre>Имя: Миша<br>Оценок: 0<br>Пятёрок: 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-15c2b37810681934','function-arguments-scope',NULL,NULL,'Напиши функцию, возвращающую новый список с добавленным предметом.','code','**Задача.** Напиши функцию, возвращающую новый список с добавленным предметом. После вызова исходный список должен остаться прежним. Используй `.copy()` и `return`; проверь также пустой список.

**Ожидаемый результат.** Функция возвращает новый список с добавленным предметом, а переданный список остаётся без изменений; это работает и для пустого списка.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cb1a0f013b2fb5cd','function-arguments-scope',NULL,NULL,'Задание 1. Площадь прямоугольника','code','**Задача.** Напиши функцию `rectangle_area(width, height)`, которая возвращает площадь. Добавь аннотации типов и docstring. Проверь функцию для двух разных прямоугольников.

**Ожидаемый результат.** Для двух прямоугольников функция возвращает произведение ширины на высоту; у функции есть аннотации типов и docstring.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-110a4f54edc37ccb','function-arguments-scope',NULL,NULL,'Задание 2. Приветствие с настройкой','code','**Задача.** Напиши функцию `greet(name, greeting="Привет")`. Она должна возвращать приветствие. Проверь вызов со значением по умолчанию и с другим приветствием.

**Ожидаемый результат.** Вызов без второго аргумента использует `"Привет"`, а вызов с другим значением использует заданное приветствие; оба вызова возвращают строки.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0202829cdcabae5e','function-arguments-scope',NULL,NULL,'Задание 3. Среднее значение','code','**Задача.** Напиши функцию `average(*numbers)`, которая возвращает среднее арифметическое переданных чисел. Подумай, что вернуть, если чисел нет.

**Ожидаемый результат.** Для непустого набора функция возвращает среднее арифметическое. Поведение при отсутствии аргументов выбрано и явно отражено в реализации.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-41268a007728690b','function-arguments-scope',NULL,NULL,'Задание 4. Карточка ученика','code','**Задача.** Напиши функцию `print_student(name, **details)`. Она должна вывести имя ученика, а затем все дополнительные сведения из словаря `details`.

**Ожидаемый результат.** Сначала напечатано имя ученика, затем — все переданные в `details` сведения.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-61aed5fa9ea1b98c','function-arguments-scope',NULL,NULL,'Ценник магазина · обязательная','code','**Сюжет.** Одинаковая функция печати цены должна поддерживать разные валюты.

**Задача.** format_price(price, currency="₽") возвращает строку с двумя знаками после точки и валютой через пробел. Добавьте docstring и аннотации типов.

**Формат данных.** price — int или float, currency — непустая строка; параметры можно передать по имени.

**Ожидаемый результат.** Возвращаемая строка, input и print внутри функции не нужны.

**Ограничения.** 0 ≤ price ≤ 1000000; currency до 10 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>format_price(12)</pre> | <pre>''12.00 ₽''</pre> |
| <pre>format_price(currency=''EUR'', price=2.5)</pre> | <pre>''2.50 EUR''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5209441a17b02192','function-arguments-scope',NULL,NULL,'Кассовый расчёт · обязательная','code','**Сюжет.** Касса поддерживает сложение и вычитание двух целых сумм.

**Задача.** calculate(a, b, *, operation="сложение") возвращает a+b либо a−b для operation="вычитание". Параметр operation только именованный.

**Формат данных.** Два целых аргумента и необязательный именованный operation.

**Ожидаемый результат.** Возвращаемое целое число.

**Ограничения.** −1000 ≤ a,b ≤ 1000; допустимы только две указанные операции.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>calculate(7, 3)</pre> | <pre>10</pre> |
| <pre>calculate(7, 3, operation=''вычитание'')</pre> | <pre>4</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-76d349d461531574','function-arguments-scope',NULL,NULL,'Самая длинная подпись · обязательная','code','**Сюжет.** Дизайнер передаёт функции произвольное число подписей.

**Задача.** find_longest_word(*words) возвращает первую из самых длинных строк. При отсутствии аргументов возвращает пустую строку.

**Формат данных.** Позиционные аргументы-строки.

**Ожидаемый результат.** Возвращаемая строка.

**Ограничения.** От 0 до 20 строк длиной до 40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>find_longest_word(''кот'', ''дом'', ''а'')</pre> | <pre>''кот''</pre> |
| <pre>find_longest_word()</pre> | <pre>''''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7f60d1dbe2836259','function-arguments-scope',NULL,NULL,'Паспорт экспоната · повторение','code','**Сюжет.** У каждого экспоната может быть свой набор характеристик.

**Задача.** describe(title, **features) возвращает заголовок, затем строки «ключ: значение» в порядке передачи характеристик.

**Формат данных.** Непустой title и дополнительные именованные значения-строки.

**Ожидаемый результат.** Одна строка с переводами строк внутри; последнего перевода строки нет.

**Ограничения.** До 10 характеристик; ключи — латинские идентификаторы, строки без переводов строк.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>describe(''Компас'', color=''синий'', year=''2026'')</pre> | <pre>Компас<br>color: синий<br>year: 2026</pre> |
| <pre>describe(''Карта'')</pre> | <pre>Карта</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b9140958379ce061','function-arguments-scope',NULL,NULL,'Пароль хранилища · по выбору','code','**Сюжет.** Хранилищу нужен пароль минимум из восьми символов с хотя бы одной ASCII-цифрой.

**Задача.** valid_password(password) возвращает True при выполнении обоих требований. Остальные символы разрешены.

**Формат данных.** Аргумент-строка.

**Ожидаемый результат.** Логическое значение.

**Ограничения.** От 0 до 100 символов; цифры в этой задаче только 0–9, символ ² не считается цифрой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>valid_password(''abcde12f'')</pre> | <pre>True</pre> |
| <pre>valid_password(''abcdefg²'')</pre> | <pre>False</pre> |
| <pre>valid_password(''abc1'')</pre> | <pre>False</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ab1cd02c21cd8fd3','function-arguments-scope',NULL,NULL,'Независимый прогноз · по выбору','code','**Сюжет.** Аналитику нужна удвоенная копия измерений без изменения исходника.

**Задача.** double_values(values) возвращает новый список удвоенных чисел. Исходник не меняется. Добавьте docstring и аннотации.

**Формат данных.** Список целых чисел — аргумент.

**Ожидаемый результат.** Новый список. Повторные вызовы независимы.

**Ограничения.** До 100 элементов от −100 до 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>double_values([1, -2, 0])</pre> | <pre>[2, -4, 0]</pre> |
| <pre>double_values([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4d2282a339848101','function-arguments-scope',NULL,NULL,'История запросов · по выбору','code','**Сюжет.** У каждого нового запроса без переданной истории должна быть собственная запись.

**Задача.** remember(item, history=None) возвращает список с добавленным item. Если history передан, изменяет и возвращает именно этот список; если нет — создаёт новый.

**Формат данных.** item — строка; history — список строк или None.

**Ожидаемый результат.** Список истории; два вызова без history не должны делить общий список.

**Ограничения.** До 30 записей; строки до 40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>remember(''А''); remember(''Б'')</pre> | <pre>Первый результат: [''А'']; второй: [''Б'']</pre> |
| <pre>items = [''А'']; remember(''Б'', items)</pre> | <pre>Результат и items: [''А'', ''Б'']; это один объект</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a530f77a159646ba','sorting-callbacks',NULL,NULL,'Практика перед выполнением ДЗ','text','**Задача.** Перед сортировкой письменно ответь: что является одним элементом? Какой ключ вернёт функция для него? Что происходит при равенстве ключей?

**Ожидаемый результат.** В письменном ответе указаны сортируемый элемент, значение ключа для него и поведение стабильной сортировки при равных ключах.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-3db9aab5aac9b8e5','sorting-callbacks',NULL,NULL,'Короткие названия · обязательная','code','**Сюжет.** Редактор списка вывесок хочет сначала показать самые короткие названия.

**Задача.** Напиши `sort_by_length(words)`, которая возвращает новый список слов в порядке увеличения длины. Если длины совпали, слова должны идти в исходном взаимном порядке. Исходный список не меняй.

**Формат данных.** Список строк `words`.

**Ожидаемый результат.** Новый список строк, отсортированный по длине.

**Ограничения.** От 0 до 100 строк; строка может быть пустой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>sort_by_length([''лиса'', ''кот'', ''дом''])</pre> | <pre>[''кот'', ''дом'', ''лиса'']</pre> |
| <pre>sort_by_length([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e0338140200b0811','sorting-callbacks',NULL,NULL,'Рейтинг игроков · обязательная','code','**Сюжет.** После турнира ведущий публикует список участников по убыванию баллов.

**Задача.** Напиши `rank_players(players)`. Верни новый список записей по убыванию `score`. При равных баллах порядок игроков из исходных данных сохраняется.

**Формат данных.** Список словарей с полями `name` (строка) и `score` (целое).

**Ожидаемый результат.** Новый список словарей в порядке рейтинга.

**Ограничения.** От 0 до 100 игроков; имена могут повторяться; баллы от 0 до 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>rank_players([{''name'': ''Ли'', ''score'': 7}, {''name'': ''Мэй'', ''score'': 9}, {''name'': ''Бо'', ''score'': 7}])</pre> | <pre>[{''name'': ''Мэй'', ''score'': 9}, {''name'': ''Ли'', ''score'': 7}, {''name'': ''Бо'', ''score'': 7}]</pre> |
| <pre>rank_players([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-01f5041e174b58fe','sorting-callbacks',NULL,NULL,'Каталог кружков · обязательная','code','**Сюжет.** Секретарь школы сортирует кружки по дню недели, а внутри одного дня — по названию.

**Задача.** Напиши `sort_clubs(clubs)`, которая возвращает новый список записей по порядку дней недели: понедельник, вторник, среда, четверг, пятница; внутри дня — по алфавиту `name`. Для сравнения дня используй список `day_order = ["понедельник", "вторник", "среда", "четверг", "пятница"]`. Исходный список не меняй.

**Формат данных.** Список словарей `{day, name}`; `day` — одна из пяти строк `day_order`.

**Ожидаемый результат.** Новый список записей, отсортированный по дню и названию.

**Ограничения.** Не более 50 кружков; названия непустые; регистр учитывается обычным образом Python.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>sort_clubs([{''day'': ''вторник'', ''name'': ''Звук''}, {''day'': ''понедельник'', ''name'': ''Роботы''}, {''day'': ''понедельник'', ''name'': ''Арт''}])</pre> | <pre>[{''day'': ''понедельник'', ''name'': ''Арт''}, {''day'': ''понедельник'', ''name'': ''Роботы''}, {''day'': ''вторник'', ''name'': ''Звук''}]</pre> |
| <pre>sort_clubs([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-96e2d8d76f6f98ef','sorting-callbacks',NULL,NULL,'Сроки сдачи · повторение','code','**Сюжет.** Классный руководитель сортирует список дел по оставшимся дням.

**Задача.** Напиши `urgent_tasks(tasks)`, возвращающую новый список названий задач с количеством дней `days` меньше либо равным `limit`. Сохрани исходный порядок выбранных задач.

**Формат данных.** Список словарей `{name, days}` и целое `limit`.

**Ожидаемый результат.** Список строк `name` для задач, срок которых не превышает `limit`.

**Ограничения.** Список может быть пустым; `days` и `limit` неотрицательны.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>urgent_tasks([{''name'': ''Плакат'', ''days'': 2}, {''name'': ''Доклад'', ''days'': 5}], 2)</pre> | <pre>[''Плакат'']</pre> |
| <pre>urgent_tasks([], 0)</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-62c510a36b70e810','oop-basics',NULL,NULL,'Создай третий объект hero3 с собственным именем и здоровьем.','code','**Задача.** Создай третий объект `hero3` с собственным именем и здоровьем.

**Ожидаемый результат.** Создан и выведен объект `hero3` с собственными значениями имени и здоровья; данные `hero1` и `hero2` не подменяют его атрибуты.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f678ae85565b601d','oop-basics',NULL,NULL,'Добавь атрибут level в __init__, передай уровень при создании двух героев и выведи его.','code','**Задача.** Добавь атрибут `level` в `__init__`, передай уровень при создании двух героев и выведи его.

**Ожидаемый результат.** У двух героев есть атрибут `level` со значениями, переданными при создании; значения выведены.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ab0cd5fde096b350','oop-basics',NULL,NULL,'Практика: Объектно-ориентированное программирование · 2','code','**Задача.** Добавь метод `status()`, который возвращает строку `"Готов к игре"`, если здоровье больше нуля, и `"Нужна помощь"` в противном случае.

**Ожидаемый результат.** `status()` возвращает `"Готов к игре"` при здоровье больше нуля и `"Нужна помощь"` при нулевом или отрицательном здоровье.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-17818009e00b3dec','oop-basics',NULL,NULL,'Добавь в класс метод add_item(self, item), который добавляет предмет в self.items через append().','code','**Задача.** Добавь в класс метод `add_item(self, item)`, который добавляет предмет в `self.items` через `append()`. Вызови метод для одного героя и проверь список методом `show_items()`.

Пример вызова должен выглядеть так: `hero2.add_item("карта")`.

**Ожидаемый результат.** Вызов `hero2.add_item("карта")` добавляет предмет в конец `hero2.items`; `show_items()` показывает обновлённый список. В примере `карта` уже была в инвентаре, поэтому после добавления она встречается дважды.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-42f501e6da6382fd','oop-basics',NULL,NULL,'Журнал ученика · обязательная','code','**Сюжет.** Электронный журнал хранит отдельную оценку каждого ученика.

**Задача.** Создайте Student(name, grade), метод show_info() печатает «ИМЯ: ОЦЕНКА», change_grade(new_grade) меняет только текущего ученика.

**Формат данных.** Создание объектов и вызовы методов из примеров; input не нужен.

**Ожидаемый результат.** Вывод show_info(); данные одного объекта не влияют на другой.

**Ограничения.** Имя непустое; оценки целые от 2 до 5. Методы изменения возвращают None.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>a = Student(''Аня'', 4); b = Student(''Миша'', 3); a.change_grade(5); a.show_info(); b.show_info()</pre> | <pre>Аня: 5<br>Миша: 3</pre> |
| <pre>a = Student(''Ян'', 2); a.show_info()</pre> | <pre>Ян: 2</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2e85c372b1fc9869','oop-basics',NULL,NULL,'Баллы игроков · обязательная','code','**Сюжет.** В игре каждому участнику начисляют собственные баллы.

**Задача.** Player(name, score=0) хранит имя и баллы; add_points(amount) прибавляет баллы данному объекту.

**Формат данных.** Создание объектов и вызовы; после них напечатайте name и score через пробел.

**Ожидаемый результат.** Одна строка на игрока в порядке создания.

**Ограничения.** 0 ≤ исходные баллы ≤ 1000; 1 ≤ amount ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>a = Player(''Аня'', 10); b = Player(''Миша'', 7); a.add_points(3)</pre> | <pre>Аня 13<br>Миша 7</pre> |
| <pre>a = Player(''Ян''); a.add_points(1)</pre> | <pre>Ян 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1e249f80787d5802','oop-basics',NULL,NULL,'Игра с питомцем · обязательная','code','**Сюжет.** У каждого питомца есть запас энергии для игр.

**Задача.** Pet(name, energy) и play(amount) уменьшают энергию, но не ниже нуля. has_energy() возвращает, осталась ли энергия.

**Формат данных.** Начальная энергия и затраты целые.

**Ожидаемый результат.** В примерах показаны energy и результат has_energy() после вызовов.

**Ограничения.** 0 ≤ energy ≤ 100; 0 ≤ amount ≤ 100; name непустой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>p = Pet(''Кот'', 5); p.play(8); print(p.energy, p.has_energy())</pre> | <pre>0 False</pre> |
| <pre>p = Pet(''Кот'', 5); p.play(2); print(p.energy, p.has_energy())</pre> | <pre>3 True</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0d847b1dc3a09e20','oop-basics',NULL,NULL,'Перекличка класса · повторение','code','**Сюжет.** Учитель хранит нескольких учеников в одном списке.

**Задача.** Реализуй `print_class(records)`. Каждый элемент `records` — пара `(имя, оценка)`. Для каждой пары создай объект `Student` и вызови его метод `show_info()`. Используй этот интерфейс класса:

```python
class Student:
    def __init__(self, name, grade):
        self.name = name
        self.grade = grade

    def show_info(self):
        print(f"{self.name}: {self.grade}")
```

**Формат данных.** `records` — список пар `(имя, оценка)`.

**Ожидаемый результат.** Для каждой записи печатается одна строка в исходном порядке, например для `[(''Аня'', 5), (''Ян'', 4)]` выводится `Аня: 5` и `Ян: 4`. Для пустого списка ничего не выводится.

**Ограничения.** До 30 записей; оценки — целые числа от 2 до 5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>print_class([(''Аня'', 5), (''Ян'', 4)])</pre> | <pre>Аня: 5<br>Ян: 4</pre> |
| <pre>print_class([])</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a2d182603290a17a','oop-basics',NULL,NULL,'Лечение героя · по выбору','code','**Сюжет.** Здоровье героя не должно превышать максимальный запас.

**Задача.** Создайте Hero(name, health, max_health) и heal(amount). Метод увеличивает здоровье до max_health, но не выше.

**Формат данных.** Параметры конструктора и вызов heal.

**Ожидаемый результат.** В примерах выводится атрибут health после лечения.

**Ограничения.** 0 ≤ health ≤ max_health ≤ 1000; amount ≥ 0.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>h = Hero(''Луч'', 8, 10); h.heal(5); print(h.health)</pre> | <pre>10</pre> |
| <pre>h = Hero(''Луч'', 0, 10); h.heal(3); print(h.health)</pre> | <pre>3</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bc2b6ed47b9d5a50','oop-basics',NULL,NULL,'Чтение книги · по выбору','code','**Сюжет.** Приложение считает непрочитанные страницы каждой книги.

**Задача.** Book(title, pages) хранит remaining=pages. read(pages) уменьшает remaining, но не ниже нуля; две книги независимы.

**Формат данных.** Создание книги и вызовы read.

**Ожидаемый результат.** В таблице показано remaining после чтения.

**Ограничения.** Название непустое; 0 ≤ начальные pages ≤ 10000; за один вызов читают неотрицательное целое число страниц.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>b = Book(''Карта'', 10); b.read(3); b.read(20); print(b.remaining)</pre> | <pre>0</pre> |
| <pre>b = Book(''Атлас'', 10); b.read(0); print(b.remaining)</pre> | <pre>10</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0b464cc57d7b8ef7','oop-basics',NULL,NULL,'Готовые к игре · по выбору','code','**Сюжет.** Приют показывает имена питомцев, у которых осталась энергия.

**Задача.** Реализуй `active_pets(pets)`, которая возвращает новый список имён питомцев с положительной энергией. Для проверки используй объекты с таким интерфейсом:

```python
class Pet:
    def __init__(self, name, energy):
        self.name = name
        self.energy = energy

    def has_energy(self):
        return self.energy > 0
```

Добавь в результат имя каждого питомца, для которого `has_energy()` возвращает `True`. Не изменяй исходные объекты.

**Формат данных.** `pets` — список объектов `Pet`.

**Ожидаемый результат.** Возвращается список имён питомцев с положительной энергией в исходном порядке. Например, `active_pets([Pet(''Кот'', 0), Pet(''Пёс'', 3)])` возвращает `[''Пёс'']`; для пустого списка возвращается `[]`.

**Ограничения.** До 20 объектов. Питомец с `energy == 0` не включается в результат.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>active_pets([Pet(''Кот'', 0), Pet(''Пёс'', 3)])</pre> | <pre>[''Пёс'']</pre> |
| <pre>active_pets([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b31b29a35c98ce38','oop-composition-inheritance',NULL,NULL,'Добавь __str__ классу Player, чтобы он возвращал Имя: N очков.','code','**Задача.** Добавь `__str__` классу `Player`, чтобы он возвращал `Имя: N очков`. Затем добавь `__repr__`, содержащий название класса и аргументы, нужные для описания игрока.

**Ожидаемый результат.** `str(player)` возвращает строку вида `Имя: N очков`; `repr(player)` показывает класс `Player` и значения `name` и `score` в форме, полезной для описания объекта.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8276f511fd4ec002','oop-composition-inheritance',NULL,NULL,'Состав команды · обязательная','code','**Сюжет.** Тренер ведёт список участников и хочет получить общий счёт команды.

**Задача.** Создайте `Player(name, score)` и `Team(name, players)`. Метод `total_score()` возвращает сумму очков. Конструктор команды сохраняет отдельную копию контейнера списка, но не копирует объекты игроков.

**Формат данных.** Строка имени команды и список объектов `Player`.

**Ожидаемый результат.** Объект `Team`; `total_score()` возвращает целое число.

**Ограничения.** До 20 игроков; очки неотрицательные целые. Для пустой команды сумма равна 0.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>team = Team("Комета", [Player("Мира", 5), Player("Лев", 3)])<br>team.total_score()</pre> | <pre>8</pre> |
| <pre>Team("Новая", []).total_score()</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9a48c0b76a7f186d','oop-composition-inheritance',NULL,NULL,'Безопасный кошелёк · обязательная','code','**Сюжет.** Приложение не должно разрешать снять больше денег, чем есть на счёте.

**Задача.** Создайте `Wallet(balance)`, метод `withdraw(amount)` возвращает `True` и списывает сумму при успешном снятии. Иначе возвращает `False`, не меняя баланс.

**Формат данных.** Начальный баланс и последовательность сумм для снятия.

**Ожидаемый результат.** Для каждого снятия — результат `True`/`False` и текущий баланс.

**Ограничения.** Начальный баланс и суммы — неотрицательные целые; сумма 0 считается недопустимой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Wallet(50); withdraw(20); withdraw(40)</pre> | <pre>True, 30<br>False, 30</pre> |
| <pre>Wallet(0); withdraw(1)</pre> | <pre>False, 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c0383d1222f0d364','oop-composition-inheritance',NULL,NULL,'Карточка книги · обязательная','code','**Сюжет.** Библиотекарь хочет видеть короткую карточку книги и подробную запись для отладки.

**Задача.** Для `Book(title, pages)` реализуйте `__str__`, возвращающий `Название — N стр.`, и `__repr__`, возвращающий строку вида `Book(title=''...'', pages=N)`. Не вызывайте `print()` внутри специальных методов.

**Формат данных.** Название книги и целое число страниц.

**Ожидаемый результат.** `str(book)` — короткая карточка; `repr(book)` — подробное представление.

**Ограничения.** Название непустое, страницы положительные; в названии нет кавычки `''`.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>book = Book("Маугли", 180)<br>str(book)</pre> | <pre>Маугли — 180 стр.</pre> |
| <pre>repr(book)</pre> | <pre>Book(title=''Маугли'', pages=180)</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0619d5f240627bfa','oop-composition-inheritance',NULL,NULL,'Уведомления · повторение','code','**Сюжет.** Сервис отправляет обычные сообщения и письма с адресом получателя.

**Задача.** Реализуйте базовый класс `Message(text)` с методом `deliver()`, затем `EmailMessage(text, address)`, который наследуется от `Message` и переопределяет `deliver()`. Используйте `super().__init__(text)`.

**Формат данных.** Текст сообщения; для письма — также адрес.

**Ожидаемый результат.** `Message.deliver()` возвращает `Сообщение: ТЕКСТ`; `EmailMessage.deliver()` — `Письмо для АДРЕС: ТЕКСТ`.

**Ограничения.** Текст и адрес непустые строки.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Message("До встречи").deliver()</pre> | <pre>Сообщение: До встречи</pre> |
| <pre>EmailMessage("До встречи", "a@example.org").deliver()</pre> | <pre>Письмо для a@example.org: До встречи</pre> |

**Повторение:** классы, `self`, `__init__`, аргументы методов, строки и `return`.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c3b7b504b655f4a7','errors-debugging',NULL,NULL,'Задание 1. Безопасное преобразование','code','**Задача.** Попроси пользователя ввести целое число. Перехвати `ValueError` и покажи понятную подсказку, если ввод не удалось преобразовать.

**Ожидаемый результат.** Целое число преобразуется и принимается; при вводе, который нельзя преобразовать, обработчик `ValueError` показывает понятную подсказку без необработанного traceback.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d430056eba93d1fb','errors-debugging',NULL,NULL,'Задание 2. Деление двух чисел','code','**Задача.** Попроси ввести делимое и делитель. Обработай отдельно неверный числовой ввод и деление на ноль. Если всё получилось, выведи частное.

**Ожидаемый результат.** Неверный числовой ввод и деление на ноль обрабатываются раздельно; при корректных числах на экран выводится частное.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6f4d3289d097e7d3','errors-debugging',NULL,NULL,'Задание 3. Найди логическую ошибку','code','**Задача.** Функция должна возвращать количество положительных чисел. Сейчас в ней есть ошибка: программа выполняется, но ответ неверный. Исправь её и проверь на нескольких списках.

**Ожидаемый результат.** `count_positive([-2, 0, 5, 7])` возвращает `2`, и функция правильно считает положительные числа в других проверенных списках.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4597626e975bc91f','errors-debugging',NULL,NULL,'Задание 4. Проверка возраста','code','**Задача.** Напиши функцию `check_age(age)`. Если возраст отрицательный, подними `ValueError`. Иначе верни `True`, если человеку не меньше 18 лет, и `False` в остальных случаях. Вызови функцию внутри `try` и обработай ошибку.

**Ожидаемый результат.** Для отрицательного возраста возникает и обрабатывается `ValueError`; для неотрицательного функция возвращает `True` при возрасте от 18 лет и `False` при меньшем возрасте.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2bc2418a2339d1e1','errors-debugging',NULL,NULL,'Возраст для заявки · обязательная','code','**Сюжет.** Оператор может ошибиться при вводе года рождения.

**Задача.** Прочитайте год. Если int не может преобразовать строку, выведите ошибку. Иначе выведите возраст к концу 2026 года. Повторного ввода нет.

**Формат данных.** Одна строка.

**Ожидаемый результат.** Целый возраст либо «Ошибка ввода».

**Ограничения.** Корректное число находится в 1900…2026; остальные строки не преобразуются в int.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2010</pre> | <pre>16</pre> |
| <pre>два</pre> | <pre>Ошибка ввода</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-48db32a56136f77f','errors-debugging',NULL,NULL,'Ячейка склада · обязательная','code','**Сюжет.** На складе хранится список ["чай", "сок", "вода"].

**Задача.** Прочитайте индекс и выведите элемент. Обработайте ValueError и IndexError разными сообщениями.

**Формат данных.** Одна строка индекса.

**Ожидаемый результат.** Название; при неверном числе «Не число»; при выходе за границы «Нет ячейки».

**Ограничения.** Если число целое, оно от −10 до 10; отрицательная индексация Python разрешена.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>-1</pre> | <pre>вода</pre> |
| <pre>3</pre> | <pre>Нет ячейки</pre> |
| <pre>x</pre> | <pre>Не число</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-34a547e237c8e48d','errors-debugging',NULL,NULL,'Поиск участника · обязательная','code','**Сюжет.** Справочник содержит {"a1": "Аня", "b2": "Борис"}.

**Задача.** Найдите имя по введённому ключу. Если ключа нет, обработайте KeyError и напечатайте отказ.

**Формат данных.** Одна строка ключа.

**Ожидаемый результат.** Имя либо «Участник не найден».

**Ограничения.** От 0 до 20 символов; регистр важен.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>a1</pre> | <pre>Аня</pre> |
| <pre>A1</pre> | <pre>Участник не найден</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-482e23bdb191b5f3','errors-debugging',NULL,NULL,'Деление ресурса · повторение','code','**Сюжет.** Сервис не разрешает делить ресурс на ноль.

**Задача.** safe_divide(a, b) возвращает a/b. При b=0 поднимите ValueError с текстом «Нулевой делитель». Напишите отдельно демонстрацию перехвата этого исключения.

**Формат данных.** Два целых аргумента.

**Ожидаемый результат.** Функция возвращает float либо поднимает указанное исключение. Таблица описывает результат вызова, не вывод traceback.

**Ограничения.** −100 ≤ a,b ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>safe_divide(5, 2)</pre> | <pre>2.5</pre> |
| <pre>safe_divide(1, 0)</pre> | <pre>ValueError: Нулевой делитель</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-94fe0d0eeff5c2e7','errors-debugging',NULL,NULL,'Потерянная сумма · по выбору','code','**Сюжет.** Прибор ошибочно сбрасывает накопитель на каждом измерении.

**Задача.** Исправьте total_values(values), чтобы она возвращала сумму, в том числе 0 для пустого списка. Найдите первую строку неверного изменения состояния с помощью отладчика. Исходный фрагмент:

```python
def total_values(values):
    for value in values:
        total = 0
        total += value
    return total
```

**Формат данных.** Список целых чисел — аргумент функции.

**Ожидаемый результат.** Возвращаемая сумма. При сдаче дополнительно укажите причину ошибки отдельным Markdown-комментарием.

**Ограничения.** До 20 элементов от −100 до 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>total_values([4, 5, 3])</pre> | <pre>12</pre> |
| <pre>total_values([])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-784f9d6f82c2c852','errors-debugging',NULL,NULL,'Завершение операции · по выбору','code','**Сюжет.** Терминал всегда сообщает об окончании операции, даже если ввод неверен.

**Задача.** В try преобразуйте ввод в int; при ValueError печатайте «Ошибка», при успехе в else печатайте «Принято: N». В finally всегда печатайте «Готово».

**Формат данных.** Одна строка.

**Ожидаемый результат.** Две строки согласно правилам.

**Ограничения.** До 30 символов; если int может преобразовать строку, значение от −100 до 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>8</pre> | <pre>Принято: 8<br>Готово</pre> |
| <pre>восемь</pre> | <pre>Ошибка<br>Готово</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-10e255a110e0c6c2','errors-debugging',NULL,NULL,'Три вопроса · по выбору','code','**Сюжет.** Викторина задаёт три заранее известных вопроса и считает ответы.

**Задача.** Правильные ответы по порядку: «4», «python», «москва». Сравнивайте после strip/lower, пустой ответ считается неверным, но игра продолжается.

**Формат данных.** Три строки ответов, возможно пустых.

**Ожидаемый результат.** Одна строка «Верно: K из 3».

**Ограничения.** До 40 символов в строке.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>Python<br>Москва</pre> | <pre>Верно: 3 из 3</pre> |
| <pre><br>java<br>москва</pre> | <pre>Верно: 1 из 3</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d1345a8c7c245d5f','pdb-debugger',NULL,NULL,'Найди строку, где появляется ошибка','code','**Задача.** Найди и исправь ошибку в функции:

```python
def calculate_total(numbers):
    for number in numbers:
        total = 0
        total = total + number
    return total
```

Функция сбрасывает `total` на каждом повторе цикла. Поставь `breakpoint()` перед `total = 0`, запусти функцию со списком `[4, 5, 3]` и сравни состояние `total` перед каждой итерацией. Если переменная ещё не создана и отладчик показывает, что она не определена, учти это при поиске места для накопителя. После исправления повтори запуск с теми же данными.

**Ожидаемый результат.** Исправленная функция на `[4, 5, 3]` возвращает `12`; накопитель сохраняет сумму предыдущих элементов, а не сбрасывается на каждой итерации.

**Что сдать.** Исправленный код и краткую трассировку `total`, показывающую, где появлялась ошибка.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4d53c0cade48434d','pdb-debugger',NULL,NULL,'Проследи выполнение внутри функции','code','**Задача.** Оставь точку остановки до вызова функции и проследи её выполнение в отладчике:

```python
scores = [4, 5, 3]
breakpoint()
answer = calculate_total(scores)
print(answer)
```

При остановке выполни `p scores`, затем `n`. На строке вызова используй `s`, чтобы войти в функцию. Посмотри аргумент, локальную переменную `total` и возвращаемое значение. Команда `n` выполнит функцию целиком и остановится после вызова; `s` позволяет просматривать её строки.

**Ожидаемый результат.** Ты видишь `scores` со значениями `[4, 5, 3]`, ход вычисления суммы внутри функции и возвращённое значение `12`; программа печатает `12`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-775dfbe81740276f','pdb-debugger',NULL,NULL,'Разбери и исправь ошибку','code','**Задача.** Разбери и исправь ошибку в программе по шагам: выбери вход, на котором результат неверен; запиши ожидаемое поведение; поставь `breakpoint()` перед первым подозрительным изменением; смотри значения командой `p имя`; проходи строки через `n`, а для входа в функцию используй `s`. Найди первую строку, после которой состояние отличается от ожидаемого, исправь причину, повтори исходный пример и добавь ещё одну проверку. Удали временные точки остановки, если они больше не нужны. Проверяй конкретную гипотезу, а не расставляй точки остановки повсюду.

**Ожидаемый результат.** Ты определяешь первое расхождение между ожидаемым и фактическим состоянием, исправляешь его и подтверждаешь исправление на исходном и ещё одном входе.

**Что сдать.** Входные данные, ожидаемый результат, найденную строку/состояние, исправление и результаты двух проверок.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-eac35e56cd8f8387','files-csv-json',NULL,NULL,'Запиши две строки, прочитай файл дважды в одном with, затем повтори после seek(0).','code','**Задача.** Запиши две строки, прочитай файл дважды в одном `with`, затем повтори после `seek(0)`. Объясни разницу. Помни: `"w"` очищает существующее содержимое уже при открытии, даже если затем ничего не записать.

**Ожидаемый результат.** Первое чтение получает обе записанные строки, второе чтение без перемещения позиции возвращает пустую строку; после `seek(0)` содержимое снова читается с начала.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9887d02ff779e965','files-csv-json',NULL,NULL,'Список дел в JSON','code','**Задача.** 1. Добавь в список дел новую задачу.
2. Сохрани обновлённый список в `tasks.json`.
3. Прочитай файл ещё раз и выведи все задачи.
4. Добавь проверку на отсутствие файла при чтении.

**Ожидаемый результат.** После повторного чтения в `tasks.json` есть новая задача и остальные задачи списка; все они выведены. Отсутствующий файл обрабатывается через `FileNotFoundError`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-084cd80428380303','files-csv-json',NULL,NULL,'Библиотечный список · обязательная','code','**Сюжет.** Библиотекарь сохраняет выбранные книги между запусками.

**Задача.** Прочитайте три названия, запишите каждое отдельной строкой в books.txt, затем перечитайте файл и выведите строки с номерами.

**Формат данных.** Три строки стандартного ввода. Файл books.txt создаётся или перезаписывается в текущей рабочей папке.

**Ожидаемый результат.** Файл содержит три названия, каждое с переводом строки. В stdout — три строки «номер. название».

**Ограничения.** Названия непустые до 80 символов; UTF-8; используйте with при записи и чтении.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Дюна<br>Хоббит<br>Солярис</pre> | <pre>1. Дюна<br>2. Хоббит<br>3. Солярис</pre> |
| <pre>А<br>Б<br>В</pre> | <pre>1. А<br>2. Б<br>3. В</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5aa5e767e2a26574','files-csv-json',NULL,NULL,'Новый участник списка · обязательная','code','**Сюжет.** К уже сохранённым книгам добавляют ещё одну, не стирая предыдущие.

**Задача.** Добавьте введённое название в books.txt через режим a. Затем выведите полное содержимое файла.

**Формат данных.** Входной books.txt и одна строка стандартного ввода с новым названием.

**Ожидаемый результат.** Дополненный файл и его текст в stdout. Не добавляйте лишние пустые строки.

**Ограничения.** Файл существует; каждая прежняя строка, включая последнюю, заканчивается переводом строки; UTF-8.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>books.txt: Дюна<br>Новое название: Хоббит</pre> | <pre>Дюна<br>Хоббит</pre> |
| <pre>books.txt пустой<br>Новое название: Атлас</pre> | <pre>Атлас</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e1f7c6f4b8df2c90','files-csv-json',NULL,NULL,'Дорогие товары · обязательная','code','**Сюжет.** Склад хранит цены в CSV, а покупатель задаёт порог.

**Задача.** Прочитайте products.csv через DictReader и выведите товары строго дороже порога. Строки сохраняют порядок файла.

**Формат данных.** CSV с заголовком name,price; в stdin одно целое число — порог.

**Ожидаемый результат.** Строки «название цена» для совпадений; при отсутствии вывода нет.

**Ограничения.** UTF-8, разделитель запятая; названия непустые без запятых; цены и порог целые от 0 до 10000. Файл может содержать только заголовок.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>products.csv:<br>name,price<br>чай,100<br>сок,150<br>Порог: 100</pre> | <pre>сок 150</pre> |
| <pre>products.csv:<br>name,price<br>Порог: 0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4bfaa9c59ae22f31','files-csv-json',NULL,NULL,'Настройки игры · повторение','code','**Сюжет.** Игра хранит громкость и имя игрока в JSON.

**Задача.** Прочитайте settings.json, измените только volume на значение из stdin и сохраните JSON обратно.

**Формат данных.** JSON-объект с name и volume; затем целая громкость в stdin.

**Ожидаемый результат.** Обновлённый JSON-файл; stdout не требуется. Пробелы, отступы и экранирование кириллицы в JSON на оценку не влияют.

**Ограничения.** Файл существует, UTF-8; name — строка, 0 ≤ volume ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>settings.json: {"name":"Аня","volume":20}<br>Ввод: 0</pre> | <pre>settings.json: {"name":"Аня","volume":0}</pre> |
| <pre>settings.json: {"name":"Ян","volume":0}<br>Ввод: 100</pre> | <pre>settings.json: {"name":"Ян","volume":100}</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9e08f582c8ce93d1','files-csv-json',NULL,NULL,'Список учеников в CSV · по выбору','code','**Сюжет.** Учитель переносит список записей в табличный файл.

**Задача.** save_students(records) записывает students.csv с заголовком name,score, затем читает файл через DictReader и возвращает восстановленный список словарей с целым score.

**Формат данных.** Аргумент — список словарей с name (строка) и score (целое).

**Ожидаемый результат.** CSV в UTF-8 и возвращаемый список, равный входному по содержимому.

**Ограничения.** До 30 записей; 0 ≤ score ≤ 100; имена непустые, до 40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>save_students([{''name'':''Аня'',''score'':5}])</pre> | <pre>[{''name'': ''Аня'', ''score'': 5}]</pre> |
| <pre>save_students([])</pre> | <pre>[]; файл содержит только заголовок name,score</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6d11839289ecf59a','files-csv-json',NULL,NULL,'Список дел между запусками · по выбору','code','**Сюжет.** Программа добавляет новую задачу к ранее сохранённым.

**Задача.** Прочитайте tasks.json как список строк, добавьте задачу из stdin и сохраните. Если файла нет, начните с пустого списка.

**Формат данных.** Необязательный tasks.json; одна непустая строка stdin — новое дело.

**Ожидаемый результат.** Обновлённый JSON-массив в файле; stdout — количество задач после добавления.

**Ограничения.** Существующий JSON корректен; до 100 прежних строк. Пустой по содержимому файл не гарантируется корректным JSON и не входит в допустимый ввод.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>tasks.json: ["читать"]<br>Ввод: писать</pre> | <pre>2; файл: ["читать", "писать"]</pre> |
| <pre>Файла нет<br>Ввод: читать</pre> | <pre>1; файл: ["читать"]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-01b26d1315e19df4','files-csv-json',NULL,NULL,'Каталог по автору · по выбору','code','**Сюжет.** Читатель ищет книги конкретного автора в сохранённом каталоге.

**Задача.** В books.json лежит список объектов с title, author, year. Выведите названия книг, у которых author в точности совпадает с введённой строкой.

**Формат данных.** Существующий JSON-файл и строка автора в stdin.

**Ожидаемый результат.** Названия в порядке файла; если совпадений нет — «Не найдено».

**Ограничения.** До 50 книг; названия/авторы непустые; регистр важен.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>books.json: [{"title":"Атлас","author":"Ли","year":2020}]<br>Ввод: Ли</pre> | <pre>Атлас</pre> |
| <pre>books.json: []<br>Ввод: Ли</pre> | <pre>Не найдено</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-183f28275e3e37bb','project-structure',NULL,NULL,'Мини-практика: разделим викторину','code','**Задача.** Создай рядом два файла: `questions.py` и `main.py`.

1. В `questions.py` создай функцию, которая возвращает вопрос и ответ. Формат возвращаемой пары выбери сам.
2. В `main.py` импортируй функцию, вызови её и используй обе части возвращённой пары.
3. Вызывай `main()` только в блоке `if __name__ == "__main__":`.

Потренируйся сначала с двумя файлами рядом, как в примере выше. Структуру пакета попробуй создать в отдельной папке проекта.

**Ожидаемый результат.** При прямом запуске `main.py` функция из `questions.py` вызывается, а вопрос и ответ используются в программе. При импорте `main.py` выполнение `main()` не начинается автоматически.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4b732f5cf385aca0','project-structure',NULL,NULL,'Общий инструмент текста · обязательная','code','**Сюжет.** Две программы должны пользоваться одной функцией обработки текста.

**Задача.** Создайте text_tools.py с upper_text(text), возвращающей текст в верхнем регистре. В main.py прочитайте строку, импортируйте функцию и выведите результат.

**Формат данных.** stdin: одна строка. Оба файла находятся в одной папке; запуск python main.py из неё.

**Ожидаемый результат.** Одна строка; при импорте text_tools постороннего вывода нет.

**Ограничения.** До 80 символов; Python 3; сторонних пакетов нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>кот</pre> | <pre>КОТ</pre> |
| <pre>PyThOn</pre> | <pre>PYTHON</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8d6111f249f9b03a','project-structure',NULL,NULL,'Запуск и импорт · обязательная','code','**Сюжет.** Вспомогательный модуль не должен запускать диалог при импорте.

**Задача.** В greeting.py определите main(), печатающую «Готово». Вызывайте её только под защитой __name__. При обычном import greeting вывода нет.

**Формат данных.** Одна из команд в таблице; запуск из папки файла.

**Ожидаемый результат.** Результат команды в stdout.

**Ограничения.** Никакого stdin и установки пакетов не требуется.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>python greeting.py</pre> | <pre>Готово</pre> |
| <pre>python -c "import greeting"</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0b1ce5cf6112fae7','project-structure',NULL,NULL,'Изолированная мастерская · обязательная','code','**Сюжет.** Для учебного проекта нужно отдельное окружение, чтобы зависимости не смешивались.

**Задача.** Создайте .venv через venv. Его интерпретатором проверьте версию Python и pip. В check_env.py выведите, различаются ли sys.prefix и sys.base_prefix. Справка: после import sys поле sys.prefix содержит путь текущего интерпретатора, а sys.base_prefix — базового, на основе которого создано окружение. Сохраните команды запуска в Markdown-ячейке.

**Формат данных.** Рабочая папка и выбранный локальный Python; стандартный ввод не используется.

**Ожидаемый результат.** Папка .venv; вывод проверки из неё — True. Версии Python/pip фиксируются фактически установленными, универсального номера нет.

**Ограничения.** Не помещайте .venv в сдаваемый архив. Команды активации зависят от ОС; используйте руководство урока.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>.venv/bin/python check_env.py (macOS/Linux)</pre> | <pre>True</pre> |
| <pre>.venv\Scripts\python.exe check_env.py (Windows)</pre> | <pre>True</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9280c5228b3137a1','project-structure',NULL,NULL,'Касса из модулей · повторение','code','**Сюжет.** Кассир хочет менять формат вывода отдельно от расчёта.

**Задача.** В pricing.py создайте total_cost(price, count), возвращающую произведение. В main.py организуйте чтение двух чисел и печать результата; pricing.py не читает input и не печатает.

**Формат данных.** Два целых числа stdin: цена, затем количество. Запуск python main.py из папки проекта.

**Ожидаемый результат.** Одно целое число.

**Ограничения.** 0 ≤ price,count ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>7<br>3</pre> | <pre>21</pre> |
| <pre>0<br>4</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ff8817c0819d1472','project-structure',NULL,NULL,'Викторина как пакет · по выбору','code','**Сюжет.** Учебную викторину запускают из корня проекта одинаковой командой.

**Задача.** Создайте пакет quiz с __init__.py, data.py (вопрос и ответ 4), logic.py (проверка ответа) и main.py (ввод/вывод). Команда запуска: python -m quiz.main. Вопрос можно хранить, но при точной проверке печатайте только итог.

**Формат данных.** Одна строка ответа stdin.

**Ожидаемый результат.** «Верно» либо «Неверно». Сдайте файлы пакета и README с командой запуска.

**Ограничения.** Ответ сравнивается после strip; правильная строка «4»; пустой ответ допустим. Импорт модулей не запускает ввод.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4</pre> | <pre>Верно</pre> |
| <pre>5</pre> | <pre>Неверно</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4eb7c0945335d378','project-structure',NULL,NULL,'Воспроизводимое окружение · по выбору','code','**Сюжет.** Другому ученику нужно повторить окружение с уже изученным пакетом requests.

**Задача.** В отдельном окружении установите requests, сохраните зависимости через pip freeze в requirements.txt. Создайте второе окружение и установите файл через pip install -r. В обоих средах проверьте импорт и совпадение requests.__version__.

**Формат данных.** Команды терминала и requirements.txt, созданный первым окружением; stdin отсутствует.

**Ожидаемый результат.** Два успешных импорта и одинаковая версия requests. В таблице критерии проверки, а не буквальный вывод с выдуманным номером версии.

**Ограничения.** Задание дополнительное; для установки нужен доступ к индексу пакетов. Используйте python -m pip соответствующего окружения. Версию не задавайте наугад — сохраните установленную.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Импорт requests в первом окружении</pre> | <pre>Импорт успешен; номер версии записан в отчёте</pre> |
| <pre>Импорт requests во втором окружении после установки requirements.txt</pre> | <pre>Импорт успешен; версия равна версии первого окружения</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b6c7d8b3fb88a566','command-line-git',NULL,NULL,'Проверь обработку ожидаемых ошибок','code','**Задача.** Проверь обработку двух ожидаемых ошибок CLI-программы: укажи отсутствующий файл и запусти её со значением `--top 0`.

**Ожидаемый результат.** В каждом случае программа объясняет проблему в сообщении командной строки и завершается с ненулевым кодом выхода, не показывая длинный traceback. В примере курса для этого используется `parser.error(...)`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-22c095cf48772a98','command-line-git',NULL,NULL,'Добавь фильтр минимальной длины','code','**Задача.** Добавь параметр `--min-length N`, чтобы программа выводила только слова длиной не меньше `N`. Раздели чтение файла, подсчёт и вывод отчёта на функции. Проверь пустой файл, файл с кириллицей, отсутствующий файл и значение порога больше длины каждого слова. Исходный файл не меняй.

**Ожидаемый результат.** В отчёте остаются только слова, длина которых не меньше переданного порога; пустой файл и файл, где все слова короче порога, не дают подходящих слов. Ошибка отсутствующего файла обрабатывается программой.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-80002be3a6cf18ad','command-line-git',NULL,NULL,'Учебный проект в Git','code','**Задача.** Выполни упражнение Git в отдельной папке `git-practice`, чтобы команды не затронули другие проекты. Создай в ней `notes.txt`, затем выполни:

```text
git init
git status
git add notes.txt
git commit -m "Добавить заметки"
```

Измени строку в `notes.txt` и посмотри разницу и состояние:

```text
git diff
git status
```

Затем добавь и зафиксируй изменение вторым коммитом, после чего просмотри историю:

```text
git add notes.txt
git commit -m "Уточнить заметки"
git log --oneline
```

Объясни, что показывают `git status`, `git diff`, `git add`, `git commit` и `git log`. Перед применением `git restore` проверь `git status` и `git diff`: эта команда отбрасывает незакоммиченные изменения. Для этого первого упражнения восстановление не требуется; эксперимент можно отменить вручную.

**Ожидаемый результат.** В истории папки `git-practice` находятся два коммита: «Добавить заметки» и «Уточнить заметки»; ты можешь объяснить назначение `status`, `diff` и `log`.

**Что сдать.** Для CLI-части: файл программы с параметром `--min-length`, вывод запуска с `--help`, один обычный запуск и сообщение об ошибке при указании отсутствующего файла. Для Git-части: список двух коммитов и краткое объяснение команд `status`, `diff` и `log`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-87204ce59f8390e4','testing-quality',NULL,NULL,'Добавь проверку двух последовательных вызовов with_item([], ...).','code','**Задача.** Проверь независимость списков в трёх вариантах. Напиши определения функций и затем добавь проверки:

```python
def with_item(items, item):
    result = items.copy()
    result.append(item)
    return result

def collect_bad(item, items=[]):
    items.append(item)
    return items

def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

1. Вызови `with_item([], "карандаш")` и `with_item([], "тетрадь")` и проверь каждый результат отдельно.
2. Вызови `collect_bad("карандаш")`, затем `collect_bad("тетрадь")` без второго аргумента и сравни оба результата.
3. Вызови `add_item("карандаш")`, затем `add_item("тетрадь")` без второго аргумента и сравни оба результата.

**Ожидаемый результат.** Два вызова `with_item` возвращают независимые списки `[''карандаш'']` и `[''тетрадь'']`. У `collect_bad` второй результат содержит оба значения, потому что список по умолчанию общий. У `add_item` вызовы возвращают независимые списки `[''карандаш'']` и `[''тетрадь'']`. Проверки явно показывают разницу между двумя функциями с аргументом по умолчанию.

**Источник.** Функции `collect_bad` и `add_item` показаны в уроке о функциях и аргументах по умолчанию; функция `with_item` — в уроке о тестировании.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ff9823937cdf75f2','testing-quality',NULL,NULL,'Задание 1. Осмысленные имена','code','**Задача.** Переименуй переменные `x`, `y` и `z` в примере так, чтобы было ясно, что он считает.

**Ожидаемый результат.** Имена `x`, `y` и `z` заменены на понятные названия для списка чисел, суммы и среднего; вычисленное среднее осталось тем же.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f4862af2149f5570','testing-quality',NULL,NULL,'Задание 2. Небольшие функции','code','**Задача.** Раздели программу на две функции: одну для вычисления суммы покупок, другую для применения скидки. Функции должны возвращать результат, а не печатать его.

**Ожидаемый результат.** Одна функция возвращает сумму покупок, другая — результат применения скидки; обе возвращают значения и не печатают их.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f72fe5118efb5ceb','testing-quality',NULL,NULL,'Задание 3. Автоматические тесты','code','**Задача.** Напиши функцию `is_adult(age)`, которая возвращает `True`, если возраст не меньше 18, и `False` иначе. Создай для неё класс `TestIsAdult` с тестами для возраста 18, 17 и 0.

**Ожидаемый результат.** Класс тестов `TestIsAdult` проверяет: для 18 возвращается `True`, для 17 и 0 — `False`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b2856b0c651df683','testing-quality',NULL,NULL,'Лидер команды · обязательная','code','**Сюжет.** Тренер проверяет функцию выбора лучшего результата.

**Задача.** largest(values) возвращает максимум непустого списка. Для пустого поднимает ValueError с текстом «Нет результатов». Подготовьте unittest-тесты для обычного, одноэлементного, отрицательного и пустого списка.

**Формат данных.** Список целых чисел — аргумент.

**Ожидаемый результат.** Возвращаемое число либо указанное исключение. Тесты проверяют требование независимо от реализации.

**Ограничения.** До 100 элементов, каждое от −1000 до 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>largest([-5, -2])</pre> | <pre>-2</pre> |
| <pre>largest([])</pre> | <pre>ValueError: Нет результатов</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-43274685a467d577','testing-quality',NULL,NULL,'Проверка парных упаковок · обязательная','code','**Сюжет.** Касса тестирует определение чётного количества.

**Задача.** is_even(n) возвращает логическое значение чётности. Напишите независимые тесты для положительного чётного, нечётного, отрицательного и нуля.

**Формат данных.** Целый аргумент n.

**Ожидаемый результат.** True или False, не строка.

**Ограничения.** −1000 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>is_even(0)</pre> | <pre>True</pre> |
| <pre>is_even(-3)</pre> | <pre>False</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f263576bb918e46b','testing-quality',NULL,NULL,'Средняя оценка · обязательная','code','**Сюжет.** Пустой журнал не должен незаметно превращаться в нулевую среднюю.

**Задача.** average(scores) возвращает среднее непустого списка и поднимает ValueError("Нет оценок") для пустого. Добавьте тесты, включая список из одного элемента.

**Формат данных.** Список целых оценок.

**Ожидаемый результат.** float либо указанное исключение; в тесте дробного среднего используйте подходящее сравнение чисел.

**Ограничения.** До 30 оценок от 2 до 5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>average([3, 4, 5])</pre> | <pre>4.0</pre> |
| <pre>average([])</pre> | <pre>ValueError: Нет оценок</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-50d7648e2d8bf384','testing-quality',NULL,NULL,'Расчёт скидки · повторение','code','**Сюжет.** Магазин допускает скидку от 0 до 100 процентов и неотрицательную цену.

**Задача.** final_price(price, discount) возвращает целую цену после скидки. Если цена отрицательная или discount вне диапазона, поднимает ValueError("Неверные данные"). Напишите тесты для 0%, 50%, 100%, нулевой цены и обоих видов ошибки.

**Формат данных.** Целые price и discount — аргументы.

**Ожидаемый результат.** Целое число либо указанное исключение.

**Ограничения.** В корректных данных 0 ≤ price ≤ 1000000, price кратна 100; 0 ≤ discount ≤ 100. Ошибочные данные в этой задаче намеренно входят в проверки.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>final_price(1000, 50)</pre> | <pre>500</pre> |
| <pre>final_price(0, 100)</pre> | <pre>0</pre> |
| <pre>final_price(-100, 50)</pre> | <pre>ValueError: Неверные данные</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-df42972ace11a142','testing-quality',NULL,NULL,'Касса с разделением обязанностей · по выбору','code','**Сюжет.** Кассе нужны расчёт суммы и форматирование чека, которые можно проверять отдельно.

**Задача.** total(prices) возвращает сумму; receipt(name, prices) возвращает «ИМЯ: СУММА ₽». Разделите расчёт и форматирование; дайте переменным понятные имена. Тестируйте обе функции, исходный список не меняйте.

**Формат данных.** Имя и список целых цен — аргументы receipt; список — аргумент total.

**Ожидаемый результат.** Число для total и строка для receipt.

**Ограничения.** До 50 цен от 0 до 10000; имя непустое.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>receipt(''Аня'', [100, 50])</pre> | <pre>''Аня: 150 ₽''</pre> |
| <pre>total([])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-034dd2c2d9d6c064','testing-quality',NULL,NULL,'Независимая копия измерений · по выбору','code','**Сюжет.** Аналитик хочет проверить, что обработка не испортила исходные данные.

**Задача.** positive_copy(values) возвращает новый список положительных элементов в прежнем порядке. Напишите тесты значения результата, неизменности входного списка и отдельности результата; проверьте два последовательных вызова.

**Формат данных.** Список целых чисел.

**Ожидаемый результат.** Новый список. Даже при пустом входе результат — отдельный объект.

**Ограничения.** До 30 элементов от −100 до 100; повторы сохраняются.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>positive_copy([0, -1, 2, 2])</pre> | <pre>[2, 2]</pre> |
| <pre>positive_copy([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cbba48144f9e4d76','testing-quality',NULL,NULL,'Защита небольшого проекта · по выбору','code','**Сюжет.** Команда готовит защиту консольной викторины.

**Задача.** В своём проекте выделите normalize_answer(text), возвращающую strip/lower, и count_correct(answers, expected), считающую точные совпадения после нормализации. Для каждой функции напишите минимум обычный и граничный unittest-тест.

**Формат данных.** Строка для первой функции; два списка строк равной длины для второй.

**Ожидаемый результат.** Возвращаемая строка или целое количество. Сдайте проект и команду запуска тестов.

**Ограничения.** До 20 ответов, до 80 символов в строке; пустые строки допустимы.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>normalize_answer('' Да '')</pre> | <pre>''да''</pre> |
| <pre>count_correct([''ДА'', ''нет''], [''да'', ''да''])</pre> | <pre>1</pre> |
| <pre>count_correct([], [])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-effb843a3a2b8f63','turtle',NULL,NULL,'Задача 1. Домик','code','**Задача.** Нарисуй домик с квадратным корпусом, треугольной крышей и дверью. Для повторяющихся сторон используй `for`, для линий — `forward` и повороты `left` или `right`; перед перемещением к двери подними перо (`penup`), а позицию задай через `goto`. Раскрась крышу и дверь.

**Ожидаемый результат.** На рисунке видны квадратный корпус, треугольная крыша и дверь; крыша и дверь окрашены.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9ada6475dedff376','turtle',NULL,NULL,'Задача 2. Светофор','code','**Задача.** Нарисуй светофор из трёх кругов, расположенных вертикально: красного, жёлтого и зелёного. Для кругов используй `dot`; координату `y` храни в переменной, а расположение элементов повтори циклом, если получается.

**Ожидаемый результат.** На рисунке три вертикально расположенных круга в порядке сверху вниз: красный, жёлтый, зелёный.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fa1f4b474448af9d','turtle',NULL,NULL,'Задача 3. Солнечный узор','code','**Задача.** Нарисуй солнце и 12 лучей вокруг него. Используй цикл, команды `forward` и `backward` и поворачивай черепашку на `30` градусов между лучами. Цвет и толщину линий выбери самостоятельно.

**Ожидаемый результат.** На рисунке есть солнце и ровно 12 лучей вокруг него; выбранный цвет и толщина линий применены.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1076b3315d8273b7','doodle-jump',NULL,NULL,'Измени цвета фона, героя и платформ. Объясни, какая строка рисует каждый объект','code','**Задача.** В Doodle Jump измени цвета фона, героя и платформ. Объясни, какая строка рисует каждый из этих объектов.

**Ожидаемый результат.** В игре видны изменённые цвета всех трёх объектов; ты можешь указать строки кода, отвечающие за их рисование.

**Что сдать.** Изменённый код и краткое объяснение строк отрисовки.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-73da5b13dfa44892','doodle-jump',NULL,NULL,'Сделай платформы шире. Проверь, почему генератор всё ещё удерживает их в окне','code','**Задача.** Сделай платформы Doodle Jump шире и проверь, почему генератор по-прежнему удерживает их внутри окна.

**Ожидаемый результат.** Платформы стали шире и остаются в пределах окна; ты можешь объяснить, как генератор ограничивает их положение.

**Что сдать.** Изменённый код и краткое объяснение проверки границ.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f5e1066c01a85575','doodle-jump',NULL,NULL,'Добавь клавишу Q для выхода, сохранив Escape и крестик','code','**Задача.** Добавь в Doodle Jump клавишу `Q` для выхода из игры, сохранив выход по `Escape` и по кнопке закрытия окна.

**Ожидаемый результат.** Игру можно закрыть каждым из трёх способов: `Q`, `Escape` и кнопкой окна.

**Что сдать.** Изменённый код и краткое объяснение обработки новой клавиши.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-519659a3bb76e949','doodle-jump',NULL,NULL,'Выведи счёт не сверху слева, а сверху справа. Используй `get_rect(topright=(WIDTH - 12, 12))`','code','**Задача.** Перемести счёт Doodle Jump из верхнего левого угла в верхний правый. Для размещения используй `get_rect(topright=(WIDTH - 12, 12))`.

**Ожидаемый результат.** Счёт выровнен по верхнему правому углу: его правый край находится на 12 пикселях левее края окна, а верхний — на 12 пикселях ниже верхнего края.

**Что сдать.** Изменённый код и краткое объяснение, как `topright` задаёт положение счёта.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7930cce3e94928c8','doodle-jump',NULL,NULL,'Измени число пикселей за один балл с 10 на 20. Как изменится результат одного и того же подъёма?','code','**Задача.** Измени правило начисления счёта за высоту: вместо 10 пикселей за один балл используй 20. Сравни результат одного и того же подъёма до и после изменения и объясни связь между пройденным расстоянием и счётом.

**Ожидаемый результат.** После изменения для получения каждого балла требуется вдвое больший подъём; тот же подъём даёт примерно вдвое меньше баллов (с учётом целочисленного округления в программе).

**Что сдать.** Изменённый код, сравнение результатов одного и того же подъёма и объяснение правила начисления.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c26b9efa1dceabf3','doodle-jump',NULL,NULL,'Сделай два режима скорости героя. Выбор должен происходить до начала попытки, чтобы случайно не менять её в полёте','code','**Задача.** Добавь два режима скорости героя в Doodle Jump. Выбор режима должен происходить до начала попытки, чтобы скорость не менялась случайно во время прыжка.

**Ожидаемый результат.** Перед запуском попытки можно выбрать один из двух режимов; выбранная скорость сохраняется на протяжении этой попытки.

**Что сдать.** Изменённый код и объяснение, как выбирается режим и почему скорость не меняется в ходе попытки.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-abf31e019b269182','doodle-jump',NULL,NULL,'Добавь надпись `"Press R"` в экран проигрыша и объясни, почему текст создаётся методом `render`','code','**Задача.** Добавь надпись `"Press R"` на экран проигрыша в Doodle Jump. Объясни, почему текст создаётся методом `render`.

**Ожидаемый результат.** После проигрыша на экране видна надпись `Press R`; в объяснении указано, что `render` создаёт поверхность с изображением текста для последующей отрисовки.

**Что сдать.** Изменённый код и краткое объяснение назначения `render`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d45a555acd53d703','doodle-jump',NULL,NULL,'Сделай воспроизводимый учебный маршрут через `random.seed` и проверь один сложный прыжок несколько раз','code','**Задача.** Сделай учебный маршрут Doodle Jump воспроизводимым с помощью `random.seed`. Выбери один сложный прыжок и проверь его несколько раз.

**Ожидаемый результат.** При повторных запусках с тем же seed генерируется один и тот же маршрут, поэтому выбранный прыжок можно проверить повторно.

**Что сдать.** Изменённый код, результаты нескольких запусков одного маршрута с тем же seed и объяснение роли `random.seed`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ecacdfe4d7a0ceb6','doodle-jump',NULL,NULL,'Вместо остановки у боковой границы придумай переход на противоположный край. Согласуй дробную x и Rect.x, как уже делал ','code','**Задача.** Вместо остановки героя у боковой границы добавь переход на противоположный край окна. Согласуй дробную координату `x` и `Rect.x`, как координату `y` в уже сделанной механике. Выбери и объясни правило перехода: когда центр героя или весь прямоугольник пересекает границу.

**Ожидаемый результат.** Герой появляется у противоположного края по выбранному правилу, а дробная координата и `Rect.x` остаются согласованными.

**Что сдать.** Изменённый код и объяснение выбранного правила перехода через границу.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-abc3e68207004b1b','doodle-jump',NULL,NULL,'Движущиеся платформы: сначала одна платформа с собственной горизонтальной скоростью, затем список таких объектов. Придёт','code','**Задача.** Добавь движущиеся платформы в Doodle Jump. Сначала реализуй одну платформу с собственной горизонтальной скоростью, затем расширь решение до списка таких платформ. Сравнивай положение платформ с положением игрока в одном и том же кадре.

**Ожидаемый результат.** Одна платформа, а затем все платформы списка перемещаются по горизонтали; проверка столкновения использует положение игрока и платформы из одного кадра.

**Что сдать.** Изменённый код и объяснение того, как сверяются позиции в одном кадре.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-aebd68fe924b69f1','doodle-jump',NULL,NULL,'Хрупкие платформы: хранить признак типа, после первого отскока удалять платформу через новый список. Потребуется следить','code','**Задача.** Добавь хрупкие платформы с признаком их типа. После первого отскока удаляй такую платформу через создание нового списка платформ. Проверь, что после удаления маршрут не становится невозможным.

**Ожидаемый результат.** Хрупкая платформа исчезает после первого отскока, остальные платформы продолжают работать, а пройти маршрут всё ещё возможно.

**Что сдать.** Изменённый код и проверки, подтверждающие удаление платформы после отскока и проходимость маршрута.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-16b3241565ecac0a','doodle-jump',NULL,NULL,'Постоянный рекорд: прочитать число из файла при запуске и записать при завершении; отдельно обработать отсутствие или по','code','**Задача.** Сделай рекорд Doodle Jump постоянным: прочитай его из файла при запуске и запиши в файл при завершении игры. Отдельно обработай ситуацию, когда файла нет или он повреждён.

**Ожидаемый результат.** Сохранённый рекорд можно прочитать при следующем запуске; отсутствие или повреждение файла обрабатывается без аварийного завершения игры.

**Что сдать.** Изменённый код и проверку чтения сохранённого рекорда, отсутствующего файла и повреждённых данных.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c6d7a701bb71dce7','doodle-jump',NULL,NULL,'Классы Player, Platform и Game: переходить к ним после того, как ученик может объяснить процедурную версию. Класс должен','code','**Задача.** После того как сможешь объяснить процедурную версию Doodle Jump, раздели уже знакомые данные и действия на классы `Player`, `Platform` и `Game`. Не переноси в классы алгоритм, который пока не можешь объяснить.

**Ожидаемый результат.** Игра сохраняет прежнее поведение, а назначение данных и действий каждого из трёх классов понятно из структуры программы.

**Что сдать.** Изменённый код и краткое объяснение ответственности `Player`, `Platform` и `Game`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d6b275cd10ef2bac','doodle-jump',NULL,NULL,'Картинка героя','code','**Задача.** После завершения игровой механики замени зелёный прямоугольник героя PNG-картинкой `player.png`, лежащей рядом с `main.py`.

1. Добавь `from pathlib import Path`.
2. После создания окна и до игрового цикла найди и подготовь картинку:

```python
image_path = Path(__file__).resolve().parent / "player.png"
source_image = pygame.image.load(str(image_path)).convert_alpha()
scale = min(
    PLAYER_WIDTH / source_image.get_width(),
    PLAYER_HEIGHT / source_image.get_height(),
)
image_size = (
    max(1, round(source_image.get_width() * scale)),
    max(1, round(source_image.get_height() * scale)),
)
player_image = pygame.transform.smoothscale(source_image, image_size)
```

`Path(__file__)` ищет файл относительно программы, а не текущего каталога терминала. `convert_alpha()` сохраняет прозрачность и вызывается после открытия окна. Масштабирование должно целиком помещать картинку в размер героя без искажения.

3. В коде отрисовки замени зелёный прямоугольник на:

```python
image_rect = player_image.get_rect(midbottom=player.midbottom)
screen.blit(player_image, image_rect)
```

Для физики продолжай использовать `player`. Видимая картинка может быть уже прямоугольника столкновения — область столкновения остаётся прямоугольной и может отличаться от контура картинки. Не загружай файл в каждом кадре. PNG-иллюстрации урока показывают схемы и не предназначены для использования целиком как картинка героя.

**Ожидаемый результат.** Вместо зелёного прямоугольника отображается выбранный PNG-спрайт, помещённый без искажения в размеры героя. Физика и прямоугольник столкновения продолжают использовать `player`, а изображение загружается до цикла один раз.

**Что сдать.** Изменённый код и файл `player.png`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-316217ff8d2b7f26','variables-print-input',NULL,NULL,'Выведите текст Я учусь Python!.','code','**Задача.** Выведите текст `Я учусь Python!`.

**Ожидаемый результат.** На экране появляется строка `Я учусь Python!`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-eae9733325dbc933','variables-print-input',NULL,NULL,'Сохраните название животного в переменную pet.','code','**Задача.** Сохраните название животного в переменную `pet`. Выведите текст `Мой любимец:` и значение переменной.

**Ожидаемый результат.** В `pet` сохранено название выбранного животного; на экране показано `Мой любимец: ` и значение `pet`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b9f5665771e7c8a5','variables-print-input',NULL,NULL,'Присвойте points значение 2 и выведите его.','code','**Задача.** Присвойте `points` значение `2` и выведите его. Затем присвойте значение `6` и снова выведите его.

**Ожидаемый результат.** На отдельных строках выведены `2`, затем `6`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bbad8676d98f5c37','variables-print-input',NULL,NULL,'Выведите слова я, учу, Python.','code','**Задача.** Выведите слова `я`, `учу`, `Python`. Используйте разделитель ` -> `.

**Ожидаемый результат.** На одной строке выведено `я -> учу -> Python`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-68f782e6d2a0d60f','variables-print-input',NULL,NULL,'Что выведет print("4" + "5")?','text','**Задача.** Что выведет `print("4" + "5")`? Что выведет `print(4 + 5)`?

**Ожидаемый результат.** Первый вызов выводит `45`, потому что складываются строки; второй выводит `9`, потому что складываются числа.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9f9c6327fc518eac','variables-print-input',NULL,NULL,'Создайте переменные a = 17 и b = 5.','code','**Задача.** Создайте переменные `a = 17` и `b = 5`. Выведите `a // b` и `a % b`.

**Ожидаемый результат.** На отдельных строках выведены результаты `a // b` и `a % b`: `3`, затем `2`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5556656014927744','variables-print-input',NULL,NULL,'Создайте переменные с именем и любимым цветом.','code','**Задача.** Создайте переменные с именем и любимым цветом. Выведите их одной командой `print()`.

**Ожидаемый результат.** Одна команда `print()` выводит выбранные имя и любимый цвет в одной строке.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0fed3c6fdad46386','variables-print-input',NULL,NULL,'Получите целое число с помощью input().','code','**Задача.** Получите целое число с помощью `input()`. Выведите это число, умноженное на 2.

**Ожидаемый результат.** После ввода целого числа на экран выводится его удвоенное значение.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5cf9e3d76d8e85c2','variables-print-input',NULL,NULL,'Задание 1. Выведи фразу','code','**Задача.** Напиши программу, которая выводит на экран одну фразу: `Я учусь программировать!`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
Я учусь программировать!
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0ab34a578a392f4c','variables-print-input',NULL,NULL,'Задание 2. Используй переменные','code','**Задача.** 1. Создай переменную `name` и сохрани в ней текст `Аня`.
2. Создай переменную `age` и сохрани в ней число `9`.
3. Выведи имя и возраст двумя командами `print()`.

**Ввод:** не нужен. Используй значения `Аня` и `9` из задания.

**Ожидаемый результат.**
```text
Её зовут Аня
Ей 9 лет
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f86a421ac3d17063','variables-print-input',NULL,NULL,'Задание 3. Измени значение переменной','code','**Задача.** 1. Сохрани число `3` в переменную `points` и выведи его.
2. Потом сохрани число `8` в эту же переменную и выведи новое значение.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
3
8
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d1690c7e7d3cb454','variables-print-input',NULL,NULL,'Задание 4. Поставь разделитель','code','**Задача.** Одной командой `print()` выведи три слова: `красный`, `зелёный`, `синий`.

Поставь между словами разделитель ` | `. Для этого используй настройку `sep`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
красный | зелёный | синий
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-995a3b55d8a3ac84','variables-print-input',NULL,NULL,'Задание 5. Используй `end`','code','**Задача.** Напиши две команды `print()`.

- Первая выводит `Привет,`.
- Вторая выводит `мир!`.
- Оба слова должны оказаться на одной строке, с одним пробелом между ними.

Используй настройку `end`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
Привет, мир!
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5f7d832e70fa2ced','variables-print-input',NULL,NULL,'Задание 6. Спроси имя','code','**Задача.** 1. С помощью `input()` спроси: `Как тебя зовут? `.
2. Сохрани ответ в переменную `name`.
3. Выведи приветствие: `Привет, имя!`.

**Ввод:** после запуска введи `Аня` и нажми Enter.

**Ожидаемый результат.**
```text
Привет, Аня!
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0b672f89cfadaf80','variables-print-input',NULL,NULL,'Задание 7. Удвой число','code','**Задача.** 1. Спроси целое число с помощью `input()`.
2. Преврати ответ в число с помощью `int()`.
3. Умножь число на `2`.
4. Выведи ответ вместе с текстом `Удвоенное число:`.

**Ввод:** после запуска введи `7` и нажми Enter.

**Ожидаемый результат.**
```text
Удвоенное число: 14
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-be2eb457790974c4','variables-print-input',NULL,NULL,'Задание 8. Сложи два числа','code','**Задача.** 1. Спроси первое целое число и сохрани его.
2. Спроси второе целое число и сохрани его.
3. Сложи числа.
4. Выведи сумму вместе с текстом `Сумма:`.

Оба ответа нужно превратить из текста в числа с помощью `int()`.

**Ввод:** сначала введи `12`, нажми Enter. Затем введи `5` и нажми Enter.

**Ожидаемый результат.**
```text
Сумма: 17
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dc86612076a74341','variables-print-input',NULL,NULL,'Задание 9. Сравни текст и числа','code','**Задача.** Напиши две команды `print()`:

1. В первой сложи тексты `"4"` и `"5"`.
2. Во второй сложи числа `4` и `5`.

Добавь подписи `Тексты:` и `Числа:`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
Тексты: 45
Числа: 9
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b6a3069634c9a73e','variables-print-input',NULL,NULL,'Задание 10. Найди целое деление и остаток','code','**Задача.** Создай переменные `a` и `b`. Сохрани в `a` число `17`, а в `b` — число `5`.

Выведи сначала результат `a // b`, а затем результат `a % b`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
3
2
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a57be68e1f4f5451','variables-print-input',NULL,NULL,'Задание 11. Спроси имя и любимый цвет','code','**Задача.** 1. Спроси имя и сохрани ответ в переменную `name`.
2. Спроси любимый цвет и сохрани ответ в переменную `color`.
3. Выведи предложение: `Имя любит цвет цвет.` Подставь ответы вместо слов `Имя` и `цвет`.

**Ввод:** сначала введи `Миша`, нажми Enter. Затем введи `синий` и нажми Enter.

**Ожидаемый результат.**
```text
Миша любит синий цвет.
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f42e9c6561b61c82','variables-print-input',NULL,NULL,'Задание 12. Выведи текст в три строки','code','**Задача.** Выведи слово `Python` три раза: каждое слово должно быть на отдельной строке.

Используй `\n` или три команды `print()`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
Python
Python
Python
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ca79e0d369fdaa87','conditions-bool-if',NULL,NULL,'Задание 1. Проверь типы значений','code','**Задача.** Напиши программу, которая показывает типы трёх значений: числа `7`, текста `"Привет"` и результата сравнения `7 > 3`. Используй `type()`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
<class ''int''>
<class ''str''>
<class ''bool''>
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0446538bc2905232','conditions-bool-if',NULL,NULL,'Задание 2. Сравни числа','code','**Задача.** Создай переменные `a = 5` и `b = 5`. Покажи результаты четырёх сравнений: `a < b`, `a <= b`, `a == b`, `a != b`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
False
True
True
False
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-eb3e6eb66defbd2c','conditions-bool-if',NULL,NULL,'Задание 3. Отличи `=` от `==`','code','**Задача.** Сохрани число `4` в переменную `number`. Покажи само число. Затем проверь, равно ли оно `4`, и равно ли оно `7`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
4
True
False
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d4cc29ec35df10de','conditions-bool-if',NULL,NULL,'Задание 4. Проверь числа с помощью `bool()`','code','**Задача.** Покажи результат `bool()` для чисел `0`, `1`, `-2` и `2.5`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
False
True
True
True
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c58e60c34d64e0d7','conditions-bool-if',NULL,NULL,'Задание 5. Проверь текст с помощью `bool()`','code','**Задача.** Покажи результат `bool()` для пустого текста `""`, одного пробела `" "`, текста `"0"` и слова `"Python"`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
False
True
True
True
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-99f5559c5631ced2','conditions-bool-if',NULL,NULL,'Задание 6. Определи правило входа по возрасту','code','**Задача.** Напиши программу с переменной `age`. Используй `if`, `elif` и `else`:

- меньше 12 лет — `Вход запрещён`;
- меньше 16 лет — `Вход разрешён с родителем`;
- до 18 лет включительно — `Вход разрешён до 19:00`;
- старше 18 лет — `Вход разрешён`.

Сначала сохрани в `age` значение `15`. После запуска программа должна вывести результат для 15 лет.

**Ввод:** не нужен, возраст уже записан в программе.

**Ожидаемый результат.**
```text
Вход разрешён с родителем
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0c837054f3da792f','conditions-bool-if',NULL,NULL,'Задание 7. Проверь другой возраст','code','**Задача.** Скопируй в ячейку ниже свою программу из задания 6. Измени значение `age` на `18`. Запусти программу ещё раз.

**Ввод:** не нужен. Используй значение `18`.

**Ожидаемый результат.**
```text
Вход разрешён до 19:00
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-46de4ddb4a84d09d','conditions-bool-if',NULL,NULL,'Задание 8. Проверь возраст 19 лет','code','**Задача.** Скопируй в ячейку ниже свою программу из задания 6. Измени значение `age` на `19`. Проверь, что выполняется ветка `else`.

**Ввод:** не нужен. Используй значение `19`.

**Ожидаемый результат.**
```text
Вход разрешён
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-eda3affd67a297c7','conditions-bool-if',NULL,NULL,'Задание 9. Используй `and`','code','**Задача.** Получи два целых числа с помощью `input()` и `int()`. Если оба числа больше нуля, выведи `Оба числа положительные`. Иначе выведи `Не оба числа положительные`.

**Ввод:** сначала введи `4`, затем `6`.

**Ожидаемый результат.**
```text
Оба числа положительные
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4e67ec4a21ed2256','conditions-bool-if',NULL,NULL,'Задание 10. Используй `or` и учти ноль','code','**Задача.** Получи два целых числа. Проверь их в таком порядке:

- если оба больше нуля, выведи `Оба числа положительные`;
- иначе, если хотя бы одно меньше нуля, выведи `Есть отрицательное число`;
- иначе выведи `Отрицательных чисел нет; есть ноль`.

**Ввод:** сначала введи `-2`, затем `0`.

**Ожидаемый результат.**
```text
Есть отрицательное число
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1f950c76011440bc','conditions-bool-if',NULL,NULL,'Задание 11. Проверь резервуар с водой','code','**Задача.** Получи количество литров через `input()` и преобразуй ответ в число с помощью `float()`.

- если количество равно нулю, выведи `Пусто`;
- иначе выведи `Вода есть`.

Считай, что вводится ноль или положительное число.

**Ввод:** введи `0`.

**Ожидаемый результат.**
```text
Пусто
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-baa0e7a52c64354a','conditions-bool-if',NULL,NULL,'Задание 12. Проверь непустой резервуар','code','**Задача.** Используй ту же программу, что в задании 11. Проверь, что она выводит правильное сообщение, если воды больше нуля.

**Ввод:** введи `2.5`.

**Ожидаемый результат.**
```text
Вода есть
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6ace98c3448520d3','while-loop-conditions',NULL,NULL,'Задание 1. Выведи числа от 1 до 4','code','**Задача.** Создай переменную `number` со значением `1`. Используй `while`, чтобы вывести числа от 1 до 4, каждое с новой строки. После каждого вывода увеличивай `number` на 1. После цикла выведи `Готово`.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
1
2
3
4
Готово
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6ed35146bfb37592','while-loop-conditions',NULL,NULL,'Задание 2. Сделай обратный отсчёт','code','**Задача.** Спроси целое число `n`. Выводи числа от `n` до `1`, уменьшая число на 1. После цикла выведи `Старт!`.

**Ввод нужен:** введи `3`.

**Ожидаемый результат.**
```text
3
2
1
Старт!
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-24d9694d41e4ad5b','while-loop-conditions',NULL,NULL,'Задание 3. Проверь ноль повторов','code','**Задача.** Создай `number = 8`. Напиши цикл `while number < 5`, который выводит `Внутри цикла`. После цикла выведи `После цикла`.

Условие сразу неверно. Проверь, что тело цикла не выполняется.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
После цикла
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ef9babc627950e54','while-loop-conditions',NULL,NULL,'Задание 4. Посчитай сумму от 1 до n','code','**Задача.** Спроси целое число `n`. С помощью `while` сложи все числа от 1 до `n` включительно. Сохраняй сумму в переменную `total`. После цикла выведи `Сумма:` и ответ.

**Ввод нужен:** введи `4`.

**Ожидаемый результат.**
```text
Сумма: 10
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d389981ecf2fa35c','while-loop-conditions',NULL,NULL,'Задание 5. Выведи нечётные числа','code','**Задача.** Используй `while`, чтобы вывести числа `1`, `3`, `5`, `7` по одному на строке. Начни с 1 и увеличивай переменную на 2 после каждого повтора.

**Ввод:** не нужен.

**Ожидаемый результат.**
```text
1
3
5
7
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-70c228c8ca9bf5c6','while-loop-conditions',NULL,NULL,'Задание 6. Повторяй ввод, пока не будет нужное слово','code','**Задача.** Спроси слово `стоп`. Пока ответ не равен слову `стоп`, выводи `Неверное слово` и спрашивай снова. Когда ответ станет `стоп`, выйди из цикла и выведи `Готово`.

Сравнение текста учитывает большие и маленькие буквы.

**Ввод нужен:** введи по очереди `начать`, `СТОП`, `стоп`.

**Ожидаемый результат.**
```text
Неверное слово
Неверное слово
Готово
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c9c2255429137a05','while-loop-conditions',NULL,NULL,'Задание 7. Проверь число от 1 до 5','code','**Задача.** Спроси целое число. Пока оно меньше 1 **или** больше 5, выведи `Число вне диапазона` и попроси ввести число снова. Когда число попадёт в диапазон, выведи `Принято:` и это число.

**Ввод нужен:** введи по очереди `0`, `6`, `4`.

**Ожидаемый результат.**
```text
Число вне диапазона
Число вне диапазона
Принято: 4
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dcf82a5f4b07aeb3','while-loop-conditions',NULL,NULL,'Задание 8. Используй `if` внутри `while`','code','**Задача.** Спроси целое число. Пока число не равно нулю:

- если число больше нуля, выведи `Положительное`;
- иначе выведи `Отрицательное`;
- затем спроси следующее число.

Когда введён ноль, закончи цикл и выведи `Готово`.

**Ввод нужен:** введи по очереди `4`, `-2`, `0`.

**Ожидаемый результат.**
```text
Положительное
Отрицательное
Готово
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-aed9abdf9d10b155','while-loop-conditions',NULL,NULL,'Задание 9. Используй `if`, `elif` и `else` внутри цикла','code','**Задача.** Программа должна три раза спросить оценку от 0 до 100. Для каждой оценки выведи:

- `Отлично`, если оценка не меньше 90;
- `Хорошо`, если оценка не меньше 70;
- `Нужно повторить` во всех остальных случаях.

Используй переменную-счётчик и цикл `while`. Внутри него размести `if / elif / else`.

**Ввод нужен:** введи по очереди `95`, `75`, `60`.

**Ожидаемый результат.**
```text
Отлично
Хорошо
Нужно повторить
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ce2ea5339c5bd5df','while-loop-conditions',NULL,NULL,'Задание 10. Сделай игру «Угадай число»','code','**Задача.** Загаданное число уже записано в программе: `secret = 7`.

Спроси догадку. Пока она не равна загаданному числу:

- если догадка меньше числа, выведи `Моё число больше`;
- если догадка больше числа, выведи `Моё число меньше`;
- спроси новую догадку и увеличь счётчик попыток.

Когда число угадано, выведи `Верно! Попыток:` и количество попыток.

**Ввод нужен:** введи по очереди `3`, `9`, `7`.

**Ожидаемый результат.**
```text
Моё число больше
Моё число меньше
Верно! Попыток: 3
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cc095633cfe1495a','while-advanced-practice',NULL,NULL,'Задание 1. Сложи числа до сигнала','code','**Задача.** Вводи целые числа, пока не появится `-1`. Число `-1` — сигнал остановки, в сумму оно не входит. Посчитай количество введённых чисел и их сумму. Выведи оба ответа.

**Ввод нужен:** введи по очереди `4`, `-2`, `7`, `-1`.

**Ожидаемый результат.**
```text
Количество: 3
Сумма: 9
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0368379b227f0cb2','while-advanced-practice',NULL,NULL,'Задание 2. Посчитай значения в диапазоне','code','**Задача.** Вводи целые числа до сигнала `0`. Ноль в подсчёт не входит. Посчитай, сколько чисел от 10 до 20 включительно.

**Ввод нужен:** введи `5`, `10`, `20`, `22`, `0`.

**Ожидаемый результат.**
```text
Количество: 2
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4244e37ad5e06710','while-advanced-practice',NULL,NULL,'Задание 3. Найди наибольшее число','code','**Задача.** Вводи целые числа до сигнала `-1`. Сигнал не учитывай. Выведи самое большое из введённых чисел. Считай, что до сигнала введено хотя бы одно число.

**Ввод нужен:** введи `4`, `9`, `2`, `-1`.

**Ожидаемый результат.**
```text
Максимум: 9
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-efb0e6db5a7e6670','while-advanced-practice',NULL,NULL,'Задание 4. Найди среднее значение','code','**Задача.** Вводи числа до сигнала `0`. Ноль не включай в расчёт. Найди сумму, количество чисел и среднее значение.

**Ввод нужен:** введи `4`, `6`, `0`.

**Ожидаемый результат.**
```text
Количество: 2
Сумма: 10
Среднее: 5.0
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-655620364433186a','while-advanced-practice',NULL,NULL,'Задание 5. Вычисли факториал','code','**Задача.** Спроси натуральное число `n`. Вычисли произведение чисел от 1 до `n` с помощью `while`. Сохраняй произведение в переменную. Ввод: `5`.

**Ввод нужен:** введи `5`.

**Ожидаемый результат.**
```text
Факториал: 120
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cf8478341e8b07d9','while-advanced-practice',NULL,NULL,'Задание 6. Посчитай положительные, отрицательные и нули','code','**Задача.** Сначала спроси, сколько чисел будет введено. Затем получи это количество чисел и с помощью `if / elif / else` посчитай, сколько среди них положительных, отрицательных и равных нулю.

**Ввод нужен:** сначала введи количество `5`, затем числа `-3`, `0`, `4`, `5`, `-1` по одному.

**Ожидаемый результат.**
```text
Положительных: 2
Отрицательных: 2
Нулей: 1
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c56fd7864944666b','while-advanced-practice',NULL,NULL,'Задание 7. Сделай игру «Угадай число» со счётчиком','code','**Задача.** Загаданное число в программе — `17`. Спроси догадку. Пока она неверная, сообщай, больше или меньше загаданного числа догадка, и спрашивай снова. Считай количество попыток, включая правильный ответ.

**Ввод нужен:** введи по очереди `10`, `20`, `17`.

**Ожидаемый результат.**
```text
Моё число больше
Моё число меньше
Верно! Попыток: 3
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8f952b58f33b5420','while-advanced-practice',NULL,NULL,'Задание 8. Найди минимальное количество слагаемых','code','**Задача.** Дано целое число `target`. Найди наименьшее `k`, для которого сумма `1 + 2 + ... + k` не меньше `target`. Используй цикл `while`, переменную суммы и счётчик.

**Ввод нужен:** введи `11`.

**Ожидаемый результат.**
```text
Количество чисел: 5
Сумма: 15
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-60c744cb819718ad','while-break-continue-range',NULL,NULL,'Задание 1. Выведи числа от 1 до `n`','code','**Задача.** Напиши программу, которая:

1. Просит ввести целое число `n`.
2. Использует `for`, чтобы вывести все числа от 1 до `n` включительно. Каждое число должно быть на новой строке.
3. После чисел выводит слово `Готово`.

**Ввод нужен:** введи число `5`.

**Подсказка:** ввод целого числа можно записать так: `n = int(input())`. Чтобы `n` попало в цикл, используй границу остановки `n + 1`.

**Ожидаемый результат.**
```text
1
2
3
4
5
Готово
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4c8ba450175285b2','while-break-continue-range',NULL,NULL,'Задание 2. Пропускай числа и остановись на восьми','code','**Задача.** Напиши программу, которая:

1. Просит ввести целое число `n`.
2. Проходит циклом `for` по числам от 1 до `n` включительно.
3. Когда число равно 8, заканчивает цикл командой `break`. Число 8 не выводится.
4. Если число делится на 3 без остатка, пропускает только его командой `continue`.
5. Остальные числа выводит, каждое на отдельной строке.
6. После цикла выводит `Проверка завершена`.

**Ввод нужен:** введи `10`.

**Почему получился такой вывод:** число 3 пропустили; число 6 тоже пропустили; на числе 8 остановились. Поэтому 8, 9 и 10 уже не рассматриваются.

**Подсказка:** проверь сначала `number == 8`, затем `number % 3 == 0`.

**Ожидаемый результат.**
```text
1
2
4
5
7
Проверка завершена
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a27f189a47606a85','mixed-lessons',NULL,NULL,'Задание 1. Знакомство','code','**Задача.** Спроси у пользователя имя и возраст. Выведи одной строкой приветствие по образцу:

```text
Привет, <имя>! Тебе <возраст> лет.
```

**Ожидаемый результат.** При вводе имени `Аня` и возраста `12` программа печатает `Привет, Аня! Тебе 12 лет.`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8e96adc410e691c3','mixed-lessons',NULL,NULL,'Задание 2. Повторялка','code','**Задача.** Спроси у пользователя слово и число `n`. Выведи это слово `n` раз, каждый раз с новой строки.

**Ожидаемый результат.** При слове `Python` и `n = 3` программа выводит три строки:

```text
Python
Python
Python
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d4ce8a9a991de188','mixed-lessons',NULL,NULL,'Задание 3. Линия из символов','code','**Задача.** Спроси один символ (например, `*` или `#`) и число `n`. Выведи строку из этого символа длиной `n`. Чтобы символы не переносились на разные строки, можно использовать `print(symbol, end="")`.

**Ожидаемый результат.** Для символа `*` и `n = 7` выводится одна строка `*******`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fde0bf18087216ca','mixed-lessons',NULL,NULL,'Задание 4. Нумерованное приветствие','code','**Задача.** Спроси у пользователя имя и число `n`. Выведи приветствие `n` раз, нумеруя строки с 1. В `for i in range(n)` переменная `i` принимает значения от 0; продумай, как получить номера 1, 2, 3, … .

**Ожидаемый результат.** Для имени `Аня` и `n = 3` программа выводит:

```text
1. Привет, Аня!
2. Привет, Аня!
3. Привет, Аня!
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-47bf922a121bc345','mixed-lessons',NULL,NULL,'Задание 5. Мини-таблица умножения','code','**Задача.** Спроси у пользователя число и выведи таблицу умножения на него от 1 до 5. Используй переменную цикла и умножение `*`.

**Ожидаемый результат.** Для числа `3` программа выводит:

```text
3 x 1 = 3
3 x 2 = 6
3 x 3 = 9
3 x 4 = 12
3 x 5 = 15
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-24595c70d7d7e0cc','mixed-lessons',NULL,NULL,'Задание 6. Чётное или нечётное','code','**Задача.** Спроси у пользователя число. Если оно чётное, выведи `Число чётное`, иначе выведи `Число нечётное`. Число чётное, если остаток от деления на 2 равен нулю: `number % 2 == 0`.

**Ожидаемый результат.** Для `4` выводится `Число чётное`, для `7` — `Число нечётное`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c24d26c9d27c748a','mixed-lessons',NULL,NULL,'Задание 7. Можно ли получать права','code','**Задача.** Спроси у пользователя возраст. Если ему 16 лет или больше, выведи `Можно получать права`; иначе выведи `Придётся подождать`.

**Ожидаемый результат.** Для возраста `18` выводится `Можно получать права`; для возраста `14` — `Придётся подождать`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1f7be742bd0ad2dc','mixed-lessons',NULL,NULL,'Задание 8. Оценка по баллам','code','**Задача.** Спроси количество баллов от 0 до 100 и выведи оценку по таблице:

| Баллы | Оценка |
|---|---|
| 90 и больше | Отлично |
| 75–89 | Хорошо |
| 60–74 | Удовлетворительно |
| меньше 60 | Неудовлетворительно |

Используй `if`, `elif` и `else`.

**Ожидаемый результат.** Для `82` программа выводит `Хорошо`; для любого введённого значения от 0 до 100 выбирается соответствующая ему строка таблицы.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-760c0ed72e567b4f','mixed-lessons',NULL,NULL,'Задание 9. Только чётные числа','code','**Задача.** Спроси у пользователя число `n`. С помощью `for` перебери числа от 1 до `n` включительно и с помощью `if` выведи только чётные.

**Ожидаемый результат.** При `n = 10` на отдельных строках выводятся `2`, `4`, `6`, `8`, `10`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c7a006b9731e2a8a','mixed-lessons',NULL,NULL,'Задание 10. Угадай секретное слово (со звёздочкой)','code','**Задача.** Загадай секретное слово, например `"python"`, и дай пользователю не больше трёх попыток. После каждой попытки: если слово угадано, выведи `Правильно!` и останови цикл; иначе выведи `Неправильно, попробуй ещё раз`. Используй `for` для трёх попыток, `if` для сравнения и `break` для досрочной остановки.

**Ожидаемый результат.** Если пользователь вводит `java`, а затем `python`, программа сначала выводит `Неправильно, попробуй ещё раз`, затем `Правильно!` и завершает цикл.',NULL,NULL,NULL);
