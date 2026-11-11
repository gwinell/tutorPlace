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
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9d28301184e99d2f','text-input-output',NULL,NULL,'Выведи название любимой книги или игры в кавычках.','code','Выведи название любимой книги или игры в кавычках. Пока не добавляй к ответу поясняющий текст.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f962626e1fe4ea48','text-input-output',NULL,NULL,'Одной командой print() выведи имя и любимый цвет через запятую.','code','Одной командой `print()` выведи имя и любимый цвет через запятую. Между ними должен появиться пробел.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b5e7aa1926889d68','text-input-output',NULL,NULL,'Создай переменную pet_name и сохрани в ней имя животного или вымышленного персонажа.','code','Создай переменную `pet_name` и сохрани в ней имя животного или вымышленного персонажа.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-525cb5793df3b1f3','text-input-output',NULL,NULL,'Создай переменную с понятным именем для любимого предмета и выведи оба значения.','code','Создай переменную с понятным именем для любимого предмета и выведи оба значения.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-06a4fc2d849408f0','text-input-output',NULL,NULL,'Попробуй назвать переменную my name.','code','Попробуй назвать переменную `my name`. Исправь имя так, чтобы программа запустилась.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-25db98fbd4fd4376','text-input-output',NULL,NULL,'Спроси у пользователя название любимой книги или игры.','code','Спроси у пользователя название любимой книги или игры. Сохрани ответ в переменную с подходящим именем, а затем покажи его командой `print()`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0a527d306edd6de6','text-input-output',NULL,NULL,'Соедини имя и фамилию в одну строку так, чтобы между ними был пробел.','code','Соедини имя и фамилию в одну строку так, чтобы между ними был пробел.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-78499149f296aa68','text-input-output',NULL,NULL,'Выведи слово Python два раза подряд.','code','Выведи слово `Python` два раза подряд.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4259493d73457dbe','text-input-output',NULL,NULL,'Нарисуй строкой рамку из 12 знаков =.','code','Нарисуй строкой рамку из 12 знаков `=`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c7f21e9f9c2b48dc','text-input-output',NULL,NULL,'Спроси имя с помощью input(), сохрани его в name, а затем одной f-строкой напиши приветствие с этим именем.','code','Спроси имя с помощью `input()`, сохрани его в `name`, а затем одной f-строкой напиши приветствие с этим именем.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5929eb0d72fb3be8','text-input-output',NULL,NULL,'Выведи три слова через звёздочку с помощью sep.','code','Выведи три слова через звёздочку с помощью `sep`. Затем двумя командами `print()` выведи фразу в одной строке, используя `end`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ed87c669ada2ed85','text-input-output',NULL,NULL,'Выведи два пункта списка на разных строках с помощью \n.','code','Выведи два пункта списка на разных строках с помощью `\n`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2cdd92d6d5e4660e','text-input-output',NULL,NULL,'Выведи подписи Имя: и Класс: с отступами \t.','code','Выведи подписи `Имя:` и `Класс:` с отступами `\t`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c1903cd75914beeb','text-input-output',NULL,NULL,'Покажи в выводе две обратные косые черты.','code','Покажи в выводе две обратные косые черты. Для каждой отображаемой черты в исходном коде нужно написать пару `\\`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4edea2d31c43f396','text-input-output',NULL,NULL,'Собери короткую программу-знакомство.','code','Собери короткую программу-знакомство. Она должна спросить имя и увлечение, а потом вывести аккуратную карточку на нескольких строках. Используй только то, что было в этом уроке: `input()`, переменные, f-строки, `print()` и `\n`.

**Подсказка:** сначала получи каждый ответ отдельно, затем составь одну f-строку с помощью `print()`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-91fb88d91bb1432c','text-input-output',NULL,NULL,'Приветствие на борту · обязательная','code','**Сюжет.** Бортовой компьютер встречает нового участника экспедиции.

**Условие.** Получите имя участника и название планеты. Подготовьте приветствие по образцу.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя, затем название планеты. | Одна строка: `Привет, ИМЯ! Добро пожаловать на планету ПЛАНЕТА.` |

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

**Условие.** Прочитайте имя получателя и город. Сформируйте открытку ровно из трёх строк.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя получателя, затем город. | Три строки: `Привет, ИМЯ!`, `Пишу тебе из города ГОРОД.`, `До встречи!`. |

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

**Условие.** Получите любимый цвет, животное и занятие. Выведите их в порядке ввода с разделителем ` | `.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: цвет, животное, занятие. | Одна строка из трёх ответов. Между соседними ответами — пробел, вертикальная черта и пробел. В начале и конце разделителя нет. |

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

**Условие.** Прочитайте имя пассажира и пункт назначения. Напечатайте билет с заголовком из двенадцати знаков равенства.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя пассажира, затем пункт назначения. | Три строки: `============`, `Пассажир: ИМЯ`, `Куда: ПУНКТ`. Заголовок получите повторением строки. |

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

**Условие.** Получите имя, любимую книгу и любимую игру. Выведите анкету с заданными подписями.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: имя, название книги, название игры. | Три строки: `Имя: ИМЯ`, `Книга: КНИГА`, `Игра: ИГРА`. После двоеточия ровно один пробел. |

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

**Условие.** Прочитайте два слова. Выведите сначала второе, затем первое, разделив их строкой ` -> `.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: по одному слову в строке. | Одна строка: `ВТОРОЕ -> ПЕРВОЕ`. |

**Ограничения.** Каждое слово содержит от 1 до 20 символов без пробелов; регистр сохраняется.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>старт<br>финиш</pre> | <pre>финиш -&gt; старт</pre> |
| <pre>А<br>Б</pre> | <pre>Б -&gt; А</pre> |

**Пояснение.** В выводе меняется порядок слов, а не порядок букв внутри них.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1f8332a920ffe72b','numbers-and-conditions',NULL,NULL,'Выведи сумму двух чисел и их произведение.','code','Выведи сумму двух чисел и их произведение. Подставь свои значения.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6d4c00ca79b76db3','numbers-and-conditions',NULL,NULL,'Попроси пользователя ввести номер любимого числа и выведи ответ с пояснением.','code','Попроси пользователя ввести номер любимого числа и выведи ответ с пояснением.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-30ce9a461c912350','numbers-and-conditions',NULL,NULL,'Попроси два целых числа, преобразуй оба ответа и выведи сумму.','code','Попроси два целых числа, преобразуй оба ответа и выведи сумму.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-83c41374c0d44ed6','numbers-and-conditions',NULL,NULL,'Сравни возраст с числом 12 с помощью >=.','code','Сравни возраст с числом 12 с помощью `>=`. Выведи полученный ответ.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-451355c690403631','numbers-and-conditions',NULL,NULL,'Спроси число.','code','Спроси число. Если оно равно 10, выведи «Нашли десять», иначе — «Это другое число».',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-acc85edb4568225e','numbers-and-conditions',NULL,NULL,'Спроси температуру.','code','Спроси температуру. Для значений ниже 0 напечатай «мороз», для значений от 0 до 20 включительно — «прохладно», иначе — «тепло».',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bba10ae38d11ddb0','numbers-and-conditions',NULL,NULL,'Проверь, находится ли число в промежутке от 1 до 10 включительно: одновременно number >= 1 и number <= 10.','code','Проверь, находится ли число в промежутке от 1 до 10 включительно: одновременно `number >= 1` и `number <= 10`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fcd61f9930f78cf2','numbers-and-conditions',NULL,NULL,'Билет доступен от 12 до 16 лет включительно.','code','Билет доступен от 12 до 16 лет включительно. Напиши проверку и проверь возраст 11, 12, 16, 17. Ожидаются ответы: нет, да, да, нет.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b92c2704200342db','numbers-and-conditions',NULL,NULL,'Запасы двух складов · обязательная','code','**Сюжет.** Экспедиция получила ящики с двух складов.

**Условие.** Найдите общее количество ящиков.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: целые количества `a` и `b`. | Одно целое число — сумма запасов. |

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

**Условие.** Найдите число полных контейнеров и количество оставшихся кристаллов.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: число кристаллов `n`, затем вместимость контейнера `k`. | Два целых числа через пробел: полные контейнеры, затем остаток. |

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

**Условие.** Сообщите, пуст ли резервуар.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое количество литров `v`. | `Пусто`, если воды нет; иначе `Вода есть`. |

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

**Условие.** По возрасту определите, разрешён ли вход.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целый возраст `age`. | `Можно`, если возраст не меньше 14; иначе `Пока рано`. |

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

**Условие.** Разделите показания на три случая: ниже нуля, выше нуля и ровно ноль.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целая температура `t`. | `Ниже нуля`, `Выше нуля` или `Ровно ноль` — одна строка. |

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

**Условие.** За 85–100 баллов поставьте 5, за 70–84 — 4, за 50–69 — 3, за 0–49 предложите повторить попытку.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое число баллов `score`. | Одна строка: `5`, `4`, `3` или `Попробуй ещё раз`. |

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

**Условие.** Определите, нарушены ли условия хранения.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целая температура `t`. | `Нарушение`, если температура вне допустимого диапазона; иначе `Норма`. |

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

**Условие.** Выведите наибольшее из трёх количеств.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: целые количества `a`, `b`, `c`. | Одно целое число — наибольший результат. Имя победителя определять не нужно. |

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

**Условие.** Вычислите разность текущего года и года рождения. Выведите её и сообщите, достигнет ли человек 18 лет к концу года. Точная дата рождения не учитывается.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: год рождения `birth`, затем текущий год `year`. | Две строки: целый возраст, затем `Совершеннолетний` при возрасте от 18 лет либо `Несовершеннолетний`. |

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

**Условие.** Для месяцев 1–6 выберите первую половину года, для 7–12 — вторую. Остальные числа обозначьте как неверный месяц.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое число `month`. | `Первая половина года`, `Вторая половина года` или `Такого месяца нет`. |

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

**Условие.** Определите, делится ли количество значков на 2.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое количество `n`. | `Да`, если значки можно разбить на пары; иначе `Нет`. |

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

**Условие.** Определите, можно ли составить невырожденный треугольник. Он существует, только если каждая сторона меньше суммы двух остальных.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: целые длины `a`, `b`, `c`. | `Треугольник существует` или `Треугольник не существует`. |

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

**Условие.** Разрешите вход человеку от 18 лет при любом слове либо человеку от 13 до 17 лет со словом `python`. Все остальные получают отказ.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: целый возраст `age`, затем кодовое слово. | `Вход разрешён` или `Вход запрещён`. |

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

**Условие.** Определите, можно ли представить общую массу как сумму двух положительных чётных целых чисел.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целая масса `w`. | `YES`, если такое разделение возможно; иначе `NO`. |

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
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8b811d904386627d','truthiness-and-conditions',NULL,NULL,'Не запуская, укажи, какую строку напечатает каждая пара значений.','code','Не запуская, укажи, какую строку напечатает каждая пара значений. Затем проверь в Python.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-44dda53000746f7f','truthiness-and-conditions',NULL,NULL,'Напиши программу, которая получает число мест seats.','code','Напиши программу, которая получает число мест `seats`. Напечатай `Есть место`, если оно больше нуля, иначе `Мест нет`. Проверь `0`, `1` и `-1`. Для отрицательного числа выбери поведение согласно условию: если отрицательные значения запрещены входными данными, не добавляй неподсказанную обработку.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-933593df699e30b5','truthiness-and-conditions',NULL,NULL,'Для уже изученной строки ответа проверь, совпадает ли она с "да" или "д".','code','Для уже изученной строки ответа проверь, совпадает ли она с `"да"` или `"д"`. Сделай таблицу проверки для `"да"`, `"д"`, `"нет"`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-85da4c38b74aeffb','truthiness-and-conditions',NULL,NULL,'Объясни разницу между числом 0 и строкой "0", а также между "" и строкой из пробела.','text','Объясни разницу между числом `0` и строкой `"0"`, а также между `""` и строкой из пробела.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b0c8c83f46bf09e9','truthiness-and-conditions',NULL,NULL,'Пустое сообщение · обязательная','code','**Сюжет.** Робот принимает текст сообщения. Даже один символ означает, что сообщение поступило.

**Условие.** Проверьте, пуста ли введённая строка. Пробелы и цифры считаются обычными символами.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка `message`, которая может быть пустой. | `Сообщение получено`, если строка непустая; иначе `Нет сообщения`. |

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

**Условие.** Выведите «Есть места» при положительном количестве, «Мест нет» при нуле, «Перебор заявок» при отрицательном количестве.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка: целое число `seats`. | Одна строка: `Есть места`, `Мест нет` или `Перебор заявок`. |

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

**Условие.** Разрешите вход, если имя непустое, а числовой код равен 2026. Иначе откажите.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя, затем целый код. | `Добро пожаловать, ИМЯ!` при разрешённом входе; иначе `Доступ закрыт`. |

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

**Условие.** Считайте согласием только ответы `да` и `д`. Любая другая строка означает отказ.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка ответа, возможно пустая. | `Участие подтверждено` при согласии; иначе `Участие отменено`. |

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

**Условие.** Если участников больше нуля и запаса хватит каждому на два литра, подтвердите готовность. Если участников нет или воды не хватает, напечатайте отказ.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: целое число участников `people`, затем целое количество литров `water`. | `Можно отправляться` или `Подготовка не завершена`. |

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
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-95bbf1e5e9c79514','python-quick-reference',NULL,NULL,'Задание 1. Знакомство','code','Напишите программу, которая запрашивает у пользователя:

- имя;
- возраст;
- город.

После этого программа должна вывести информацию в виде:

```text
Меня зовут: Алекс
Мне 18 лет
Я живу в: Хельсинки
```

Используйте `input()` и f-строку.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-21f2e685c364174c','python-quick-reference',NULL,NULL,'Задание 2. Расчёт возраста','code','Запросите у пользователя его имя и год рождения. Рассчитайте примерный возраст и выведите сообщение:

```text
Алекс, вам примерно 18 лет.
```

Для получения года рождения используйте `int()`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9568f1bf1712ba1e','python-quick-reference',NULL,NULL,'Задание 3. Чек','code','Запросите у пользователя:

- название товара;
- цену товара;
- количество товара.

Рассчитайте общую стоимость и выведите:

```text
Товар: Яблоки
Цена: 2.5 €
Количество: 4
Итого: 10.0 €
```

Используйте переменные, `input()`, `int()` или `float()` и f-строку.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b275c925fcc14140','python-quick-reference',NULL,NULL,'Задание 4. `sep` и `end`','code','Самостоятельно создайте программу, которая с помощью `print()`, `sep` и `end` выводит информацию минимум в 3 строки.

Попробуйте использовать разные разделители:

```python
sep=" | "
sep="-"
sep=", "
```

и разные значения `end`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a3121aa8b8c98fec','python-quick-reference',NULL,NULL,'Задание 5. Мини-профиль','code','Создайте программу, которая спрашивает у пользователя:

- имя;
- фамилию;
- возраст;
- профессию;
- любимый язык программирования.

Затем выведите красиво оформленный профиль с помощью f-строк.

Пример:

```text
=== Профиль ===
Имя: Алекс Иванов
Возраст: 18
Профессия: Студент
Любимый язык: Python
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a1dea3057cae17dd','for-step-by-step',NULL,NULL,'Задание на предсказание','text','Не запускай сразу: выпиши, что напечатает каждая строка и сколько всего будет строк. Потом запусти и сравни.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b267e05f8994d850','for-step-by-step',NULL,NULL,'Практика чтения','text','Заполни на бумаге таблицу для `range(3, 8, 2)`: запиши все значения, которые получит `n`. Затем проверь:',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f7d63c190d6fbaf9','for-step-by-step',NULL,NULL,'Задание: поменяй программу','code','Измени программу с квадратами так, чтобы она выводила куб каждого числа от 1 до `N`. Куб — это число, умноженное на себя три раза. Подсказка: `number * number * number`.

Добавь ниже свою ячейку или используй эту:',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dd5669b8a51559d5','for-step-by-step',NULL,NULL,'Посчитай сумму чётных чисел от 1 до n включительно.','code','Посчитай сумму чётных чисел от 1 до `n` включительно. Проверь `n = 1` → 0, `n = 2` → 2, `n = 6` → 12. Объясни, почему начальное значение суммы равно нулю.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7c353a4df2a9fbb4','for-step-by-step',NULL,NULL,'Сигналы маяка · обязательная','code','**Сюжет.** Маяк отправляет одинаковое сообщение несколько раз.

**Условие.** Выведите сообщение ровно n раз. Используйте for.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Первая строка — сообщение; вторая — целое n. | По одной копии сообщения на строке. При n=0 ничего не выводите. |

**Ограничения.** Сообщение непустое, до 40 символов; 0 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Привет<br>3</pre> | <pre>Привет<br>Привет<br>Привет</pre> |
| <pre>Старт<br>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b43509ed337963ad','for-step-by-step',NULL,NULL,'Номера экспедиции · обязательная','code','**Сюжет.** Каждый участник получает номер по порядку.

**Условие.** Выведите номера от 1 до n включительно.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Номера по одному на строке; при n=0 вывод пустой. |

**Ограничения.** 0 ≤ n ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>1<br>2<br>3</pre> |
| <pre>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-66b94d4bd6dc1e6b','for-step-by-step',NULL,NULL,'Площадь квадратных участков · обязательная','code','**Сюжет.** Картограф рассматривает участки со сторонами от 1 до n метров.

**Условие.** Для каждой стороны выведите её длину и площадь квадрата.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | n строк вида «сторона площадь» через пробел. |

**Ограничения.** 1 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>1 1<br>2 4<br>3 9</pre> |
| <pre>1</pre> | <pre>1 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-96cecc9761623838','for-step-by-step',NULL,NULL,'Бананы для солдата · повторение','code','**Сюжет.** Покупатель платит за первый банан k монет, за второй 2k, за третий 3k и так далее.

**Условие.** Найдите недостающую сумму для w бананов, если уже есть n монет. Если денег хватает, ответ 0.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: k, n, w. | Одно целое число — недостающая сумма. |

**Ограничения.** 1 ≤ k,w ≤ 1000; 0 ≤ n ≤ 1000000000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>17<br>4</pre> | <pre>13</pre> |
| <pre>2<br>20<br>3</pre> | <pre>0</pre> |

**Источник.** Адаптация [Codeforces 546A — Soldier and Bananas](https://codeforces.com/problemset/problem/546/A). Условие пересказано. Числа читаются с трёх строк вместо одной, поэтому чтение ввода нужно изменить перед отправкой на Codeforces.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-abe2db74bb352dde','for-step-by-step',NULL,NULL,'Чётные ячейки · по выбору','code','**Сюжет.** Склад выдаёт ячейки с чётными номерами.

**Условие.** Для номеров от 1 до n выведите чётные номера, затем их количество и сумму.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Сначала подходящие номера по одному на строке, затем строка «Количество: K» и строка «Сумма: S». Если подходящих номеров нет, выведите только две итоговые строки с нулями. |

**Ограничения.** 0 ≤ n ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>5</pre> | <pre>2<br>4<br>Количество: 2<br>Сумма: 6</pre> |
| <pre>1</pre> | <pre>Количество: 0<br>Сумма: 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-421b69fd0e2442d3','for-step-by-step',NULL,NULL,'Таблица стоимости · по выбору','code','**Сюжет.** Один жетон стоит a рублей. Кассиру нужны цены наборов от одного до десяти жетонов.

**Условие.** Выведите количество жетонов и стоимость каждого набора.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое a. | 10 строк вида «количество стоимость», разделённых пробелом. |

**Ограничения.** 0 ≤ a ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2</pre> | <pre>1 2<br>2 4<br>3 6<br>4 8<br>5 10<br>6 12<br>7 14<br>8 16<br>9 18<br>10 20</pre> |
| <pre>0</pre> | <pre>1 0<br>2 0<br>3 0<br>4 0<br>5 0<br>6 0<br>7 0<br>8 0<br>9 0<br>10 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ef1f3ad6af15dc51','for-step-by-step',NULL,NULL,'Резервная линия · по выбору','code','**Сюжет.** Датчики нумеруются от 1 до n. На резервную линию попадают номера, кратные 2 или 5.

**Условие.** Посчитайте подходящие номера. Число, кратное обоим делителям, учитывается один раз.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое количество. |

**Ограничения.** 0 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>10</pre> | <pre>6</pre> |
| <pre>1</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8aad7606fe26ef6f','for-step-by-step',NULL,NULL,'Квадратные панели · по выбору','code','**Сюжет.** Для ступени i требуется i² небольших панелей.

**Условие.** Найдите общее число панелей для ступеней от 1 до n.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое число. |

**Ограничения.** 0 ≤ n ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>14</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-721adca49393a436','for-step-by-step',NULL,NULL,'Пропуск на участок · по выбору','code','**Сюжет.** Инспектор обходит участки от 1 до n; доступ разрешён только номерам больше 3 и меньше 8.

**Условие.** Для каждого номера выведите его и статус.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | n строк: номер, пробел, «доступ» либо «закрыто». |

**Ограничения.** 1 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4</pre> | <pre>1 закрыто<br>2 закрыто<br>3 закрыто<br>4 доступ</pre> |
| <pre>1</pre> | <pre>1 закрыто</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-296a621b43815217','for-practice',NULL,NULL,'Перекличка роботов · обязательная','code','**Сюжет.** Контролёр приветствует роботов одной серии.

**Условие.** Получите имя серии и число роботов. Напечатайте приветствие для каждого.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: имя и n. | n строк «Привет, ИМЯ!». При n=0 вывод пустой. |

**Ограничения.** Имя до 30 символов; 0 ≤ n ≤ 20.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Луна<br>2</pre> | <pre>Привет, Луна!<br>Привет, Луна!</pre> |
| <pre>Луч<br>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-535d1461fb881317','for-practice',NULL,NULL,'Контрольные метки · обязательная','code','**Сюжет.** Маршрут содержит метки с номерами от 1 до n.

**Условие.** Напечатайте все номера меток.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | По номеру на строке; при n=0 вывод пустой. |

**Ограничения.** 0 ≤ n ≤ 30.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2</pre> | <pre>1<br>2</pre> |
| <pre>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4bbb69e2a2753244','for-practice',NULL,NULL,'Парные посты · обязательная','code','**Сюжет.** Проверка нужна только постам с чётными номерами.

**Условие.** Выведите чётные номера от 1 до n.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | По номеру на строке; если номеров нет, вывод пустой. |

**Ограничения.** 0 ≤ n ≤ 30.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>6</pre> | <pre>2<br>4<br>6</pre> |
| <pre>1</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-22b7e4a0553c694c','for-practice',NULL,NULL,'План сада · повторение','code','**Сюжет.** В саду строят квадратные клумбы со сторонами от 1 до n.

**Условие.** Для каждой стороны покажите её и площадь.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | n строк: сторона и площадь через пробел. |

**Ограничения.** 1 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2</pre> | <pre>1 1<br>2 4</pre> |
| <pre>1</pre> | <pre>1 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-820d7de85ae113c0','for-practice',NULL,NULL,'Цена наборов · по выбору','code','**Сюжет.** Киоск продаёт одинаковые наборы по a рублей.

**Условие.** Подготовьте таблицу цены от одного до трёх наборов.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое a. | 3 строки: количество и цена через пробел. |

**Ограничения.** 0 ≤ a ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>7</pre> | <pre>1 7<br>2 14<br>3 21</pre> |
| <pre>0</pre> | <pre>1 0<br>2 0<br>3 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-762629411ecb7106','for-practice',NULL,NULL,'Монеты за этапы · по выбору','code','**Сюжет.** За этап i участнику дают i монет.

**Условие.** Сложите награды первых n этапов циклом.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое число — общая награда. |

**Ограничения.** 0 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4</pre> | <pre>10</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-30b7ea2a6a1dc2a8','for-practice',NULL,NULL,'Каждый третий · по выбору','code','**Сюжет.** Посетители получают номера от 1 до n, каждый третий — подарок.

**Условие.** Посчитайте получателей подарка.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое количество. |

**Ограничения.** 0 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>9</pre> | <pre>3</pre> |
| <pre>2</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d0db4e354ec7c984','for-practice',NULL,NULL,'Чётные выплаты · по выбору','code','**Сюжет.** За этапы с чётными номерами выплачивают столько монет, каков номер этапа.

**Условие.** Найдите сумму выплат для этапов 1…n.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое число. |

**Ограничения.** 0 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>6</pre> | <pre>12</pre> |
| <pre>1</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f5fa1c0f211bdb6d','for-practice',NULL,NULL,'Панели по этажам · по выбору','code','**Сюжет.** На этаже i устанавливают i² панелей.

**Условие.** Найдите число панелей на первых n этажах.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Одно целое число. |

**Ограничения.** 0 ≤ n ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4</pre> | <pre>30</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c47685632a05b967','for-practice',NULL,NULL,'Метки через одну · по выбору','code','**Сюжет.** Строитель ставит метки через два метра, начиная с позиции start.

**Условие.** Выведите позиции start, start+2 и так далее, пока позиция строго меньше stop.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: start и stop. | Каждую позицию на отдельной строке; при отсутствии позиций вывод пустой. |

**Ограничения.** −20 ≤ start,stop ≤ 20. Если start ≥ stop, меток нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>7</pre> | <pre>2<br>4<br>6</pre> |
| <pre>5<br>5</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-93cfb3afe35ea931','while-and-random',NULL,NULL,'Измени программу: Сделай так, чтобы печатались числа от 1 до 6.','code','Измени программу:

Сделай так, чтобы печатались числа от 1 до 6.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f1781b2df0d0c711','while-and-random',NULL,NULL,'Измени программу: Измени команду увеличения: пусть счётчик каждый раз растёт на 2.','code','Измени программу:

Измени команду увеличения: пусть счётчик каждый раз растёт на 2. Какое условие подойдёт, чтобы получить `1, 3, 5`?',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c27f10a92d6b387d','while-and-random',NULL,NULL,'Попроси ввести число от 1 до 5.','code','Попроси ввести число от 1 до 5. Пока введённое число меньше 1 **или** больше 5, попроси ввести его снова. Используй `int()` и `or`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-42013f8cd7a7ea0c','while-and-random',NULL,NULL,'Улучши игру','code','Добавь счётчик попыток: создай `attempts = 1` до цикла и увеличивай его на 1 после каждого нового ввода. После победы выведи количество попыток.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c0dd48c12b57cd65','while-and-random',NULL,NULL,'Спроси число.','code','Спроси число. Повторяй ввод, пока число не будет меньше 0 или больше 100. Для продолжения используй условие `number < 0 or number > 100`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9f7aa23d3d7020a5','while-and-random',NULL,NULL,'Выведи числа от 1 до 10, пропуская кратные 3, и остановись перед 8.','code','Выведи числа от 1 до 10, пропуская кратные 3, и остановись перед 8. Ожидается: 1, 2, 4, 5, 7. Реши через `for`, затем через `while`. Проверь, что в обоих случаях счётчик продвигается после пропуска.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-73c3d64bc5a9da4b','while-and-random',NULL,NULL,'Обратный отсчёт · обязательная','code','**Сюжет.** Диспетчер запускает аппарат после обратного отсчёта.

**Условие.** Выведите числа от n до 1 и затем «Старт!». Используйте while.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | Числа по одному на строке и финальное сообщение; при n=0 только сообщение. |

**Ограничения.** 0 ≤ n ≤ 20.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>3<br>2<br>1<br>Старт!</pre> |
| <pre>0</pre> | <pre>Старт!</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e0f35d2adc556f9e','while-and-random',NULL,NULL,'Пароль шлюза · обязательная','code','**Сюжет.** Шлюз принимает пароль «луна», остальные попытки отвергает.

**Условие.** Читайте попытки до первого правильного пароля. Для каждой неправильной печатайте отказ, затем сообщение об открытии.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Несколько строк с попытками. | На каждую ошибку «Неверно»; при первом совпадении «Открыто». Дальше ввод не читается. |

**Ограничения.** Успешная попытка есть не позднее десятой строки; регистр важен.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>солнце<br>луна</pre> | <pre>Неверно<br>Открыто</pre> |
| <pre>луна</pre> | <pre>Открыто</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-032ce84e4b960f5a','while-and-random',NULL,NULL,'Выбор отсека · обязательная','code','**Сюжет.** Допустимые номера отсека — от 1 до 20 включительно.

**Условие.** Читайте числа до первого допустимого. Для отклонённых чисел сообщайте об ошибке диапазона.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| По одному целому числу на строку. | «Вне диапазона» для каждой ошибки и «Отсек N» при успехе. |

**Ограничения.** −100 ≤ число ≤ 100; допустимое появится за первые 10 строк.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>0<br>21<br>20</pre> | <pre>Вне диапазона<br>Вне диапазона<br>Отсек 20</pre> |
| <pre>1</pre> | <pre>Отсек 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9da24ee54abc2e3f','while-and-random',NULL,NULL,'Безопасные показания · повторение','code','**Сюжет.** Перед пуском диспетчер проверяет датчики.

**Условие.** Получите n показаний и посчитайте, сколько лежат от 10 до 20 включительно.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Сначала n, затем n целых чисел по одному на строку. | Одно целое количество. |

**Ограничения.** 0 ≤ n ≤ 100; −100 ≤ показание ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>9<br>10<br>20<br>21</pre> | <pre>2</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-453c224c4ca3fbbf','while-and-random',NULL,NULL,'Запасы до сигнала · по выбору','code','**Сюжет.** Склад принимает партии, пока не придёт завершающий ноль.

**Условие.** Сложите размеры партий и посчитайте их. Ноль в расчёт не входит.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Положительные целые числа по одному на строку, затем 0. | Количество и сумма через пробел. |

**Ограничения.** Не более 100 партий, каждая до 1000; ноль обязательно присутствует.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>7<br>0</pre> | <pre>2 11</pre> |
| <pre>0</pre> | <pre>0 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-558e7551e56db89f','while-and-random',NULL,NULL,'Тренажёр угадывания · по выбору','code','**Сюжет.** Тестовый тренажёр сообщает, больше или меньше догадка загаданного числа.

**Условие.** Первая строка задаёт секрет для проверки. Читайте догадки до совпадения; выведите число всех догадок, включая верную.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Секрет, затем догадки по одному целому на строку. | Для неверной догадки «Больше», если секрет больше, иначе «Меньше». При совпадении «Угадано: K». |

**Ограничения.** Все числа от 1 до 20; совпадение есть за первые 10 догадок.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>7<br>10<br>3<br>7</pre> | <pre>Меньше<br>Больше<br>Угадано: 3</pre> |
| <pre>1<br>1</pre> | <pre>Угадано: 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5d88d5cc6392d551','while-and-random',NULL,NULL,'Пять запросов · по выбору','code','**Сюжет.** У поискового робота есть не больше пяти попыток назвать секрет.

**Условие.** Повторите правила тренажёра, но завершите после пятой неверной догадки. После поражения выведите секрет.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Сначала секрет, затем не более пяти догадок; после успеха ввод прекращается. | Подсказки как в предыдущей задаче. При успехе «Победа: K»; после последней ошибки вместо подсказки «Проигрыш: S». |

**Ограничения.** Секрет и догадки от 1 до 20; при отсутствии успеха дано ровно 5 догадок.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>1<br>1<br>1<br>1<br>2</pre> | <pre>Больше<br>Больше<br>Больше<br>Больше<br>Победа: 5</pre> |
| <pre>2<br>1<br>1<br>1<br>1<br>1</pre> | <pre>Больше<br>Больше<br>Больше<br>Больше<br>Проигрыш: 2</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2e9130096dc8daa2','while-and-random',NULL,NULL,'Игровой автомат · по выбору','code','**Сюжет.** Автомат предлагает случайное занятие: A — рисунок, B — чтение, C — прогулка.

**Условие.** Для команды «да» выбирайте код через random.choice("ABC") и печатайте соответствующее занятие. При «нет» завершите работу, для другого ответа напечатайте «Повторите команду».

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Команды по одной на строку. | Для «да» ровно одна строка из «Рисунок», «Чтение», «Прогулка»; для «нет» — «До встречи». В примерах показаны возможные результаты, они могут отличаться при запуске. |

**Ограничения.** Не более 10 команд, последняя — «нет»; код случайный.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>нет</pre> | <pre>До встречи</pre> |
| <pre>да<br>ошибка<br>нет</pre> | <pre>Чтение<br>Повторите команду<br>До встречи</pre> |

**Пояснение.** Второй пример допустим, если автомат выбрал B. При проверке временно фиксируй выбранный код, затем верни случайный выбор.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2882e4ef64116951','while-practice',NULL,NULL,'Задание 1. Максимум до нуля','code','1. «Максимум до нуля»

Справка: не требуется. Просто сравнение чисел.
Условие: Программа считывает целые числа (по одному). Ввод заканчивается числом 0 (не входит в расчёт). Выведите максимальное из всех введённых чисел. Если чисел не было (сразу введён 0), выведите "Нет данных".
Пример: Ввод: 7 -3 12 5 0 → Вывод: 12',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-098bb3297814316c','while-practice',NULL,NULL,'Задание 2. Факториал числа','code','2. «Факториал числа»

Справка: Факториал числа n (обозначается n!) — это произведение всех натуральных чисел от 1 до n включительно. Например, 5! = 1·2·3·4·5 = 120. По определению 0! = 1, но мы берём n > 0.
Условие: Дано натуральное n. Вычислите n! с помощью цикла while. Результат выведите как целое число.
Пример: n = 5 → Вывод: 120',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f04435ceccc17918','while-practice',NULL,NULL,'Задание 3. Проверка на простоту','code','3. «Проверка на простоту»

Справка: Простое число — это натуральное число больше 1, которое имеет ровно два различных делителя: 1 и само себя. Например, 2, 3, 5, 7, 11 — простые. 4 — нет (делится на 2). Для проверки достаточно искать делители до √n, так как если есть делитель больше корня, то есть и меньший.
Условие: Дано натуральное n > 1. Определите, является ли оно простым. Выведите "Да" или "Нет". Используйте while для проверки делителей.
Пример: n = 17 → "Да"; n = 18 → "Нет"',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ca8d98b8024f119b','while-practice',NULL,NULL,'Задание 4. Числа Фибоначчи до N','code','4. «Числа Фибоначчи до N»

Справка: Числа Фибоначчи — последовательность, где первые два числа равны 1, а каждое следующее равно сумме двух предыдущих: 1, 1, 2, 3, 5, 8, 13, ....
Условие: Дано натуральное N. Выведите все числа Фибоначчи, не превосходящие N, каждое на новой строке. Используйте цикл while.
Пример: N = 10 → Вывод: 1 1 2 3 5 8 (каждое с новой строки)',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4feced0bfbbb3348','while-practice',NULL,NULL,'Задание 5. Сумма цифр числа','code','5. «Сумма цифр числа»

Справка: Чтобы получить последнюю цифру числа, используйте операцию % 10, чтобы отбросить последнюю цифру — целочисленное деление на 10 (// 10). Повторяйте, пока число не станет 0.
Условие: Дано натуральное n. Выведите сумму всех его цифр. Используйте арифметические операции (без строк).
Пример: n = 1234 → Вывод: 10',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9d53a61eb96a9587','while-practice',NULL,NULL,'Задание 6. Алгоритм Евклида (НОД)','code','6. «Алгоритм Евклида (НОД)»

Справка: НОД (наибольший общий делитель) двух чисел — это самое большое число, на которое делятся оба без остатка. Алгоритм Евклида: пока одно из чисел не станет нулём, заменяем большее на остаток от деления на меньшее. Когда одно стало 0, другое и есть НОД.
Условие: Даны два натуральных числа a и b. Найдите их НОД, используя алгоритм Евклида с циклом while.
Пример: Ввод: 48 18 → Вывод: 6',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d4cf1594cdeb0d72','while-practice',NULL,NULL,'Задание 7. Обратный отсчёт с шагом','code','7. «Обратный отсчёт с шагом»

Справка: не требуется, чисто арифметика.
Условие: Даны целые числа start и step (step > 0). Выведите числа от start до 1 включительно, уменьшая каждый раз на step. Например, start=10, step=3 → 10, 7, 4, 1. Используйте while.
Пример: Ввод: 20 6 → Вывод: 20 14 8 2 (каждое с новой строки)',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cfeb69bf87e89037','while-practice',NULL,NULL,'Задание 8. Количество чётных до нуля','code','8. «Количество чётных до нуля»

Справка: чётное число делится на 2 без остатка (n % 2 == 0).
Условие: Программа считывает целые числа до тех пор, пока не встретит 0. Подсчитайте, сколько среди введённых чисел было чётных (0 не учитывается). Выведите это количество.
Пример: Ввод: 4 7 2 9 0 → Вывод: 2 (чётные: 4 и 2)',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0045fe0a09f2a5a0','while-practice',NULL,NULL,'Задание 9. Бесконечный ввод с суммой','code','9. «Бесконечный ввод с суммой»

Справка: не требуется.
Условие: Пользователь вводит числа. Цикл продолжается, пока сумма введённых чисел не станет больше 100. Выведите итоговую сумму и количество введённых чисел.
Пример: Ввод: 30 20 60 → Вывод: Сумма: 110, чисел: 3 (после 60 сумма стала 110, цикл остановился)',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-88f79579001172fb','while-practice',NULL,NULL,'Задание 10. Золотая середина','code','10. «Золотая середина»

Справка: нужно найти такое целое k, чтобы сумма 1+2+...+k была не меньше заданного n. Это классическая задача на накопление суммы в цикле.
Условие: Дано натуральное n. Найдите минимальное целое k, такое, что сумма чисел от 1 до k (т.е. 1+2+...+k) будет больше или равна n. Выведите k и саму сумму.
Пример: n = 10 → Вывод: k = 4, сумма = 10 (1+2+3+4=10)
n = 11 → Вывод: k = 5, сумма = 15 (1+2+3+4+5=15 ≥ 11)',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-372fbd113301e0b6','nested-loops',NULL,NULL,'Задание на чтение','code','Сколько значений напечатает программа? Для каждого результата назови пару множителей. Затем измени внутренний цикл так, чтобы вывести только пары, в которых второй множитель не меньше первого. Используй знакомый `if`; не создавай пока список пар.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2644e0839fe36b4f','nested-loops',NULL,NULL,'Нарисуй прямоугольник шириной 2 и высотой 4 из символов @.','code','Нарисуй прямоугольник шириной 2 и высотой 4 из символов `@`. Напиши словами, за что отвечает каждый цикл.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0a7820727de3432d','nested-loops',NULL,NULL,'Напечатай лестницу из чисел: для высоты 3 строки должны содержать 1, затем 1 2, затем 1 2 3.','code','Напечатай лестницу из чисел: для высоты 3 строки должны содержать `1`, затем `1 2`, затем `1 2 3`. Подсказка: при каждом значении внешнего счётчика внутренний цикл идёт от 1 до текущего номера строки включительно.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d45f23674add6f06','nested-loops',NULL,NULL,'Напечатай сетку из 3 строк и 4 точек.','code','Напечатай сетку из 3 строк и 4 точек. Поэкспериментируй с `row` и `column`, чтобы вывести их координаты.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1328bea1eba45aa4','nested-loops',NULL,NULL,'Вручную проследи циклы на height = 0 и width = 0.','code','Вручную проследи циклы на `height = 0` и `width = 0`. Напиши, что напечатается в каждом случае.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-780f5b74283d8482','nested-loops',NULL,NULL,'Схема мест в зале · обязательная','code','**Сюжет.** Места в зале нумеруются слева направо по рядам, следующий ряд продолжает нумерацию.

**Условие.** Выведите таблицу номеров от 1. Используйте внешний цикл по рядам и внутренний по местам.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: r — число рядов, c — мест в ряду. | r строк по c номеров через один пробел, без пробела в конце строки. |

**Ограничения.** 1 ≤ r ≤ 8; 1 ≤ c ≤ 9.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>3</pre> | <pre>1 2 3<br>4 5 6</pre> |
| <pre>3<br>1</pre> | <pre>1<br>2<br>3</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-506a9c2c4d9b6e95','nested-loops',NULL,NULL,'Экран табло · обязательная','code','**Сюжет.** На табло показывают прямоугольный значок.

**Условие.** Нарисуйте h строк по w символов @.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: h, затем w. | Ровно h строк заданной ширины. |

**Ограничения.** 0 ≤ h,w ≤ 10. При h=0 нет строк, при w=0 каждая строка пустая.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>3</pre> | <pre>@@@<br>@@@</pre> |
| <pre>0<br>3</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-735f14d1754474ba','nested-loops',NULL,NULL,'Ступени трибуны · обязательная','code','**Сюжет.** На ступени i нужно поместить номера от 1 до i.

**Условие.** Выведите числовую лестницу высотой n.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно целое n. | n строк; на строке i числа 1…i через пробел. При n=0 вывод пустой. |

**Ограничения.** 0 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3</pre> | <pre>1<br>1 2<br>1 2 3</pre> |
| <pre>1</pre> | <pre>1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dacfeb22a661ac30','nested-loops',NULL,NULL,'Таблица заказов · повторение','code','**Сюжет.** Производитель рассчитывает стоимость наборов: строки задают число изделий, столбцы — цену одного изделия.

**Условие.** Постройте таблицу произведений чисел 1…r и 1…c.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две строки: r и c. | r строк по c произведений через пробел. |

**Ограничения.** 1 ≤ r,c ≤ 5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>3</pre> | <pre>1 2 3<br>2 4 6</pre> |
| <pre>1<br>1</pre> | <pre>1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-83f6612bef3c4582','algorithm-design',NULL,NULL,'Практикум 1. Сумма и количество после изучения `for`','code','**Сюжет.** В списке записано число посылок, доставленных курьером в каждый из `n` дней. Нужно узнать общее число посылок и сколько дней было с доставкой не меньше пяти.

**Вход:** сначала `n`, затем `n` целых чисел по одному на строку. Гарантируется `1 ≤ n ≤ 100`, `0 ≤ deliveries ≤ 20`.

**Выход:** общая сумма и число подходящих дней через пробел.

До кода заполни таблицу для `n = 4` и значений `2, 5, 0, 7`. Нарисуй две независимые переменные состояния: сумма начинает с нуля и изменяется каждый день; счётчик начинается с нуля и растёт только при выполнении условия. Затем напиши пошаговый план.

**Проверки:** четыре дня дают `14 2`; одно значение `4` даёт `4 0`; одно значение `5` даёт `5 1`.

**Перенос:** измени условие на «строго больше пяти». Скажи, какой пример различает старую и новую версию.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-33907b23983c97a2','algorithm-design',NULL,NULL,'Практикум 2. Выбор и частоты после изучения коллекций','code','**Сюжет.** В списке времени доставки в минутах нужно найти самое быстрое время и посчитать, сколько доставок были не дольше 30 минут.

Гарантируется, что список непустой, поэтому первое время можно временно принять за лучшее. Для нового значения сравни его с лучшим и замени лучший, только если новое значение меньше. Для количества отдельно используй счётчик.

Вручную разберись со значениями `42, 30, 30, 51` и `8`. Запиши, как меняется лучший ответ после каждого элемента, сколько элементов прошло ограничение, и что произойдёт при равенстве.

**Тесты:** `42, 30, 30, 51` → минимум `30`, подходящих `2`; `8` → минимум `8`, подходящих `1`.

**Граница:** отдельно обсуди, почему алгоритм с начальным минимумом `0` не подходит для положительных времён.

**Перенос:** посчитай количество появлений заданного числа. Не создавай таблицу частот, если достаточно одного счётчика.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b64f988dbac4c87f','algorithm-design',NULL,NULL,'Практикум 3. Разделение задачи на функции после изучения функций','code','**Сюжет.** Программа принимает оценки команды и выводит среднюю оценку и количество оценок не ниже заданного порога. Раздели ответственность на функции: одна считает сумму, другая — число прошедших порог, третья объединяет вычисления и печатает результат.

Пока вход непустой. Реши пример `3, 4, 5` с порогом `4`: среднее `4.0`, прошли `2` человека. Затем отдельно проверь одну оценку и случай, когда никто не прошёл.

До кода запиши для каждой функции: что она получает, что возвращает, меняет ли список. Не печатай результат внутри функции, которая по условию должна вернуть число.

**Перенос:** замени проходной порог, не меняя вычисление среднего. Объясни, какие функции пришлось изменить и почему.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7448d81ab12d8ebe','lists',NULL,NULL,'Создай список из четырёх любимых игр, книг или блюд.','code','Создай список из четырёх любимых игр, книг или блюд. Выведи первый, второй и последний элементы. Для списка из `n` элементов последний положительный индекс равен `n - 1`, а последний отрицательный — всегда `-1`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ad00e1397ad8ee37','lists',NULL,NULL,'Возьми срез списка numbers, чтобы получить [2, 3, 4].','code','Возьми срез списка `numbers`, чтобы получить `[2, 3, 4]`. Подумай, какой индекс поставить в `start` и какой — в `stop`. Затем возьми элементы через один.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c0374dae1b1f5104','lists',NULL,NULL,'Создай список покупок и отдельную копию для друга.','code','Создай список покупок и отдельную копию для друга. Замени первый товар только в копии друга по индексу. Покажи оба списка и объясни, какой командой получена копия.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-3b74c15e71750f93','lists',NULL,NULL,'Задание 1. Индексы','code','Создай строку с названием города. Выведи первый и последний символ, количество символов и срез из первых трёх символов.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-72ed3e7ffa7d8a0d','lists',NULL,NULL,'Задание 2. Список покупок','code','Создай список из четырёх продуктов. Выведи второй продукт, последний продукт и количество продуктов. Замени один продукт по индексу.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-40b071df6534b243','lists',NULL,NULL,'Задание 3. План дня','code','Создай список из трёх дел. Добавь дело в конец через `append()`, вставь дело в начало через `insert()`, затем удали одно дело через `remove()`. После каждого действия печатай список.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b8fa0505e438ebd8','lists',NULL,NULL,'Задание 4. Два списка','code','Создай список с двумя именами и второй список с тремя именами. Добавь второй список в первый двумя способами: сначала через `append()`, потом через `extend()`. Объясни разницу.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0262a5efa523931c','lists',NULL,NULL,'Карточка названия · обязательная','code','**Сюжет.** Музей показывает короткие сведения о названии экспоната.

**Условие.** Прочитайте название, выведите первый символ, последний символ и длину, каждое значение на своей строке.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна непустая строка. | Три строки в указанном порядке. |

**Ограничения.** Длина от 1 до 50 символов; регистр и пробелы сохраняются.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Компас</pre> | <pre>К<br>с<br>6</pre> |
| <pre>Я</pre> | <pre>Я<br>Я<br>1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f582abad04f93154','lists',NULL,NULL,'Контрольные грузы · обязательная','code','**Сюжет.** На ленте стоят ровно пять грузов. Проверить нужно первый, третий и последний.

**Условие.** Соберите введённые числа в список и выведите выбранные значения.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Пять целых чисел по одному на строку. | Три числа на отдельных строках. |

**Ограничения.** 0 ≤ масса ≤ 100. В этом уроке числа читаются отдельно; split ещё не нужен.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>1<br>2<br>3<br>4<br>5</pre> | <pre>1<br>3<br>5</pre> |
| <pre>0<br>0<br>0<br>0<br>0</pre> | <pre>0<br>0<br>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4d1e5bed08b049fc','lists',NULL,NULL,'Архив измерений · обязательная','code','**Сюжет.** Архив хранит фиксированные измерения [10, 20, 30, 40, 50, 60].

**Условие.** Создайте этот список. Выведите срез со второго по четвёртый элемент, первые три, элементы начиная с четвёртого и элементы через один с начала.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Ввода нет: используйте заданный список. | Четыре строки, каждая — представление списка Python. |

**Ограничения.** Исходный список не изменяется.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Нет ввода</pre> | <pre>[20, 30, 40]<br>[10, 20, 30]<br>[40, 50, 60]<br>[10, 30, 50]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a7e3e75ae4661f1c','lists',NULL,NULL,'Сигнальные огни · повторение','code','**Сюжет.** Оператор меняет второй из трёх сигнальных огней и добавляет запасной четвёртый.

**Условие.** Получите три цвета, новый цвет второго огня и цвет запасного. Замените второй элемент списка и добавьте запасной в конец.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Пять строк в указанном порядке. | Первая строка — список Python из четырёх цветов, вторая — его длина. |

**Ограничения.** Строки непустые, до 20 символов; повторы разрешены.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>красный<br>синий<br>белый<br>зелёный<br>жёлтый</pre> | <pre>[''красный'', ''зелёный'', ''белый'', ''жёлтый'']<br>4</pre> |
| <pre>а<br>а<br>а<br>б<br>б</pre> | <pre>[''а'', ''б'', ''а'', ''б'']<br>4</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-252cfaebaeec9df7','lists',NULL,NULL,'Меню буфета · по выбору','code','**Сюжет.** В меню ["чай", "сок", "вода"] нужно добавить напиток перед соком, а сок убрать.

**Условие.** Прочитайте новый напиток, вставьте его на индекс 1 и удалите первое вхождение «сок» по значению.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка — новый напиток. | Обновлённый список Python. |

**Ограничения.** Название непустое, до 30 символов и не равно «сок».

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>какао</pre> | <pre>[''чай'', ''какао'', ''вода'']</pre> |
| <pre>чай</pre> | <pre>[''чай'', ''чай'', ''вода'']</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5295de993e19e640','lists',NULL,NULL,'Багажные метки · по выбору','code','**Сюжет.** В списке ["мяч", "книга", "мяч"] повторяется метка.

**Условие.** Выведите индекс первого мяча; затем удалите элемент с индексом 1 и выведите список.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Ввода нет, список дан в условии. | Индекс и список на разных строках. |

**Ограничения.** Индексы начинаются с нуля.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Нет ввода</pre> | <pre>0<br>[''мяч'', ''мяч'']</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7adc744233d3c177','lists',NULL,NULL,'Два способа упаковки · по выбору','code','**Сюжет.** Поставку [3, 4] можно добавить в список [1, 2] как одну упаковку или как два отдельных предмета.

**Условие.** На двух независимых копиях [1, 2] примените append([3, 4]) и extend([3, 4]). Выведите обе копии и исходный список.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Ввода нет. | Три представления списков на отдельных строках. |

**Ограничения.** Исходный список должен остаться [1, 2].

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Нет ввода</pre> | <pre>[1, 2, [3, 4]]<br>[1, 2, 3, 4]<br>[1, 2]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e919e8aa8f34248d','lists',NULL,NULL,'Маршрут обратно · по выбору','code','**Сюжет.** Навигатор показывает название маршрута в обратном порядке букв.

**Условие.** Получите строку и создайте её перевёрнутую копию срезом. Выведите копию, затем исходную строку.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка. | Две строки: обратная и исходная. Для пустого ввода обе строки пустые. |

**Ограничения.** От 0 до 50 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>река</pre> | <pre>акер<br>река</pre> |
| <pre>Я</pre> | <pre>Я<br>Я</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8c310eff0b9f24e7','lists-in-loops',NULL,NULL,'Измени список оценок.','code','Измени список оценок. Проверь, правильно ли цикл считает количество пятёрок. Затем замени условие так, чтобы считать оценки меньше `4`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5eb2711bc83cfc3c','lists-in-loops',NULL,NULL,'Создай таблицу 3 × 3, измени только центральную клетку на 1.','code','Создай таблицу 3 × 3, измени только центральную клетку на 1. Ожидается `[[0, 0, 0], [0, 1, 0], [0, 0, 0]]`. Объясни, почему изменение не затронуло другие строки.

Списковое включение создаёт готовый список. С выражениями-генераторами в круглых скобках познакомишься в [дополнительном уроке об итераторах](https://github.com/gwinell/proglang-courses/blob/codetogether/python-course/python/03_collections/04_iterators/lesson_iterators_generators.ipynb).',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-edabd46f0ac023c3','lists-in-loops',NULL,NULL,'Задание 1. Выводим элементы','code','Создай список из пяти любимых фильмов, книг или игр. С помощью `for` выведи каждый элемент на отдельной строке. Добавь шестой элемент и проверь, нужно ли менять цикл.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-03fa41ee00163494','lists-in-loops',NULL,NULL,'Задание 2. Числа больше десяти','code','Дан список `[4, 15, 8, 23, 10, 17]`. С помощью `for` и `if` выведи числа больше `10`. Измени границу и сравни результат.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8c17c8a1005a1091','lists-in-loops',NULL,NULL,'Задание 3. Изменяем значения','code','Дан список `[3, 6, 9, 12]`. Перебери его по индексам и замени каждый элемент числом, увеличенным в три раза. Выведи список после цикла.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9b7bb868d4530ea9','lists-in-loops',NULL,NULL,'Задание 4. Перебираем список через `while`','code','Создай список из четырёх городов. Начни с `index = 0`, пока индекс меньше длины списка печатай элемент и увеличивай индекс. Проверь, что цикл завершится.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-73acfa5fb0f2f6bf','lists-in-loops',NULL,NULL,'Посылки для робота · обязательная','code','**Сюжет.** Подъёмник принимает только посылки легче 5 кг.

**Условие.** Соберите новый список подходящих масс, сохранив порядок, и выведите его длину и содержимое.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Сначала n, затем n целых масс по одной на строку. | Количество, затем список Python на следующей строке. Исходные данные не меняйте. |

**Ограничения.** 0 ≤ n ≤ 100; 0 ≤ масса ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>5<br>2<br>5<br>1<br>8<br>4</pre> | <pre>3<br>[2, 1, 4]</pre> |
| <pre>0</pre> | <pre>0<br>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c3fabdea2267afaa','lists-in-loops',NULL,NULL,'Длинные названия · обязательная','code','**Сюжет.** Для широких этикеток подходят названия длиннее четырёх символов.

**Условие.** Получите n названий и выведите подходящие в порядке ввода.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n строк. | По названию на строке; при отсутствии совпадений вывод пустой. |

**Ограничения.** 0 ≤ n ≤ 20; длина названия от 1 до 30.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>дом<br>компас<br>река</pre> | <pre>компас</pre> |
| <pre>1<br>река</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0cdecce729b4a173','lists-in-loops',NULL,NULL,'План обхода · обязательная','code','**Сюжет.** Робот читает список дел от начала к концу.

**Условие.** Получите дела и выведите каждое через while со счётчиком индекса.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n непустых строк. | Дела по одному на строке. |

**Ограничения.** 0 ≤ n ≤ 20; до 40 символов на дело.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>зарядка<br>осмотр</pre> | <pre>зарядка<br>осмотр</pre> |
| <pre>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2ee252cf4043c85a','lists-in-loops',NULL,NULL,'Обратная выгрузка · повторение','code','**Сюжет.** Грузы снимают с ленты с конца.

**Условие.** Получите числа и выведите их от последнего к первому через while.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n целых чисел по одному на строку. | По числу на строке; при n=0 вывод пустой. |

**Ограничения.** 0 ≤ n ≤ 20; −100 ≤ число ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>10<br>20<br>30</pre> | <pre>30<br>20<br>10</pre> |
| <pre>0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-578e851906d9c27b','lists-in-loops',NULL,NULL,'Поправка термометра · по выбору','code','**Сюжет.** Каждый датчик занижает температуру на два градуса.

**Условие.** Создайте новый список, увеличив каждое измерение на 2, и сохраните исходный. Первый вариант решите через for/append, затем запишите равнозначное списковое включение.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n целых температур. | Две строки: исправленный список Python и исходный список. |

**Ограничения.** 0 ≤ n ≤ 20; −100 ≤ температура ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>-2<br>0<br>5</pre> | <pre>[0, 2, 7]<br>[-2, 0, 5]</pre> |
| <pre>0</pre> | <pre>[]<br>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9502708bd7020ad5','lists-in-loops',NULL,NULL,'Подсчёт премий · по выбору','code','**Сюжет.** Премию дают за результаты, кратные трём.

**Условие.** Посчитайте подходящие элементы списка, включая повторные значения и ноль.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n целых чисел. | Одно целое количество. |

**Ограничения.** 0 ≤ n ≤ 100; −100 ≤ число ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>3<br>4<br>0<br>9</pre> | <pre>3</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-94e0ba9655c7533d','lists-in-loops',NULL,NULL,'Подписи к плакатам · по выбору','code','**Сюжет.** Дизайнер добавляет восклицательный знак к каждой подписи.

**Условие.** Постройте новый список подписей с добавленным знаком !; исходный список сохраните. Сделайте обычный и сокращённый варианты.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n строк, возможно пустых. | Новый список Python и исходный на разных строках. |

**Ограничения.** 0 ≤ n ≤ 20; до 30 символов в строке.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>Ура<br></pre> | <pre>[''Ура!'', ''!'']<br>[''Ура'', '''']</pre> |
| <pre>0</pre> | <pre>[]<br>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-15c8665856823b0c','lists-in-loops',NULL,NULL,'Подходящие оценки · по выбору','code','**Сюжет.** Для витрины достижений нужны оценки 4 и 5.

**Условие.** Из введённого списка оставьте только 4 и 5. Сохраните порядок и повторы.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n оценок. | Список Python. |

**Ограничения.** 0 ≤ n ≤ 100; каждая оценка от 2 до 5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>3<br>5<br>4<br>2</pre> | <pre>[5, 4]</pre> |
| <pre>2<br>2<br>3</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2dbea7a199fe4ad0','lists-in-loops',NULL,NULL,'Крупные расходы · по выбору','code','**Сюжет.** Бухгалтеру нужна сумма только расходов строго больше 500 рублей.

**Условие.** Найдите эту сумму, не меняя список.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n целых расходов. | Одно целое число. |

**Ограничения.** 0 ≤ n ≤ 100; 0 ≤ расход ≤ 10000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>500<br>501<br>700</pre> | <pre>1201</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-76997beeae56cb9f','lists-in-loops',NULL,NULL,'Изменение ресурсов · по выбору','code','**Сюжет.** Положительные запасы удваиваются, нулевые и отрицательные остаются как есть.

**Условие.** Создайте новый список по этому правилу. Первое решение напишите обычным циклом и условием; затем попробуйте включение с if/else.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n целых чисел. | Новый список Python. |

**Ограничения.** 0 ≤ n ≤ 100; −100 ≤ число ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>3<br>-2<br>0<br>7</pre> | <pre>[6, -2, 0, 14]</pre> |
| <pre>0</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5c08cfa31e8f25ed','lists-in-loops',NULL,NULL,'Ответы на приглашение · по выбору','code','**Сюжет.** Организатор получил ответы «да», «нет» или «не знаю».

**Условие.** Посчитайте ответы «да» и создайте новый список без ответов «нет».

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n ответов по одному на строку. | Количество согласий, затем список оставшихся ответов Python. |

**Ограничения.** 0 ≤ n ≤ 30; ответы только из трёх указанных вариантов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>да<br>нет<br>да<br>не знаю</pre> | <pre>2<br>[''да'', ''да'', ''не знаю'']</pre> |
| <pre>1<br>нет</pre> | <pre>0<br>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a7ecc49e7e8047e1','string-methods',NULL,NULL,'Убери пробелы вокруг имени, а затем выведи приветствие с этим именем.','code','Убери пробелы вокруг имени, а затем выведи приветствие с этим именем.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fc0c9cd0009a851f','string-methods',NULL,NULL,'Исправь название города, заменив Питер на Санкт-Петербург.','code','Исправь название города, заменив `Питер` на `Санкт-Петербург`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-948d3a3159e4cffc','string-methods',NULL,NULL,'Раздели строку по запятым, а затем собери список обратно, поставив между элементами " / ".','code','Раздели строку по запятым, а затем собери список обратно, поставив между элементами `" / "`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cb9f22a378413b51','string-methods',NULL,NULL,'Практика: аккуратная анкета','code','Сделай небольшую программу:

1. Попроси пользователя ввести имя и город.
2. Убери пробелы по краям с помощью `strip()`.
3. Сделай имя с заглавной буквы с помощью `title()`.
4. Выведи сообщение: `Привет, <имя>! Ты живёшь в городе <город>.`',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0ff327c922bbd6d6','string-methods',NULL,NULL,'Две этикетки · обязательная','code','**Сюжет.** На упаковку печатают крупную и обычную подпись.

**Условие.** Получите строку, выведите её в верхнем, затем в нижнем регистре.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка. | Две строки в указанном порядке. |

**Ограничения.** До 80 символов; строка может быть пустой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>PyThOn</pre> | <pre>PYTHON<br>python</pre> |
| <pre>Кот</pre> | <pre>КОТ<br>кот</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9ffa501ca6c50c70','string-methods',NULL,NULL,'Счётчик букв · обязательная','code','**Сюжет.** Редактор считает строчную кириллическую букву «а» в сообщении.

**Условие.** Выведите число вхождений именно символа «а»; заглавная «А» не учитывается.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка. | Одно целое число. |

**Ограничения.** До 100 символов; пустая строка допустима.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Аня и мама</pre> | <pre>2</pre> |
| <em>Пустая строка (Enter)</em> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2d2ca52ee34cfbb5','string-methods',NULL,NULL,'Проверка вложения · обязательная','code','**Сюжет.** Каталог принимает изображения с суффиксом .png.

**Условие.** Проверьте, заканчивается ли имя файла на .png без учёта регистра.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна непустая строка — имя файла. | YES при совпадении, иначе NO. |

**Ограничения.** До 80 символов; пробелов по краям нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Map.PNG</pre> | <pre>YES</pre> |
| <pre>map.png.txt</pre> | <pre>NO</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-df04ce626ba60b60','string-methods',NULL,NULL,'Сообщение афиши · повторение','code','**Сюжет.** Для афиши нужно убрать пробелы по краям и заменить точки на восклицательные знаки.

**Условие.** Выполните оба преобразования, внутренние пробелы сохраните.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка. | Одна обработанная строка, возможно пустая. |

**Ограничения.** До 100 символов; может состоять только из пробелов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>  Ждём. Сегодня.  </pre> | <pre>Ждём! Сегодня!</pre> |
| <pre>   </pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-63d311bfba47f06e','string-methods',NULL,NULL,'Имена в списке · по выбору','code','**Сюжет.** Сервис получает имена, разделённые любым числом пробелов.

**Условие.** Разделите строку на слова и выведите каждое слово с новой строки.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка. | По слову на строке; для пустой строки вывода нет. |

**Ограничения.** До 100 символов; пустая строка допустима.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>  Аня   Миша </pre> | <pre>Аня<br>Миша</pre> |
| <em>Пустая строка (Enter)</em> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a5ebe4c03f1bc7b6','string-methods',NULL,NULL,'Меню через запятую · по выбору','code','**Сюжет.** Повар перечисляет три блюда через запятые.

**Условие.** Разделите ввод, уберите пробелы по краям каждого названия и соедините названия разделителем «; ».

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка с ровно двумя запятыми. | Одна строка с тремя очищенными названиями. |

**Ограничения.** Три названия непустые после удаления краевых пробелов; запятых внутри названий нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre> суп, чай ,каша </pre> | <pre>суп; чай; каша</pre> |
| <pre>а,б,в</pre> | <pre>а; б; в</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-daead81fbb8081b8','string-methods',NULL,NULL,'Подпись с заглавной буквы · по выбору','code','**Сюжет.** Каталог меняет только первую букву заголовка.

**Условие.** Сделайте первый символ заглавным, остальные оставьте без изменений.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одно непустое слово. | Преобразованное слово. |

**Ограничения.** От 1 до 1000 английских букв.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>konjac</pre> | <pre>Konjac</pre> |
| <pre>ApPLe</pre> | <pre>ApPLe</pre> |

**Источник.** Пересказ [Codeforces 281A — Word Capitalization](https://codeforces.com/problemset/problem/281/A). Формат и требование сохранены.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-46deb87867eaa9ee','string-methods',NULL,NULL,'Короткие подписи · по выбору','code','**Сюжет.** Очень длинные слова не помещаются на карточках.

**Условие.** Слова длиной больше 10 замените первой буквой, числом внутренних букв и последней буквой; остальные сохраните.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n слов по одному на строку. | По результату на слово, в том же порядке. |

**Ограничения.** 1 ≤ n ≤ 100; слова из 1–100 строчных латинских букв.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2<br>localization<br>word</pre> | <pre>l10n<br>word</pre> |
| <pre>2<br>abcdefghij<br>abcdefghijk</pre> | <pre>abcdefghij<br>a9k</pre> |

**Источник.** Пересказ [Codeforces 71A — Way Too Long Words](https://codeforces.com/problemset/problem/71/A). Ввод и правило порога сохранены; свои примеры.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a2f31b8e03845c12','string-methods',NULL,NULL,'Поиск курса · по выбору','code','**Сюжет.** Поисковик ищет отдельное слово python среди слов запроса.

**Условие.** Посчитайте слова, определите наличие слова python без учёта регистра и соедините исходные слова знаком ★.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка; слова разделены пробельными символами. | Три строки: число слов; YES/NO; слова через ★, с исходным регистром. Для пустого ввода третья строка пустая. |

**Ограничения.** До 100 символов; знаков препинания нет; пустая строка допустима.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Я учу PYTHON</pre> | <pre>3<br>YES<br>Я★учу★PYTHON</pre> |
| <pre>pythonic</pre> | <pre>1<br>NO<br>pythonic</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8ae98c73f219c5b0','tuples-dicts-sets',NULL,NULL,'Создай словарь book с ключами "title", "author" и "year".','code','Создай словарь `book` с ключами `"title"`, `"author"` и `"year"`. Выведи название книги и добавь ключ `"pages"`.

План: создай три пары; прочитай название по ключу title; добавь pages; выведи весь словарь и проверь изменения.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-62b4d922da2e38e7','tuples-dicts-sets',NULL,NULL,'Посчитай слова в строке "дом лес дом" через split().','code','Посчитай слова в строке `"дом лес дом"` через `split()`. Ожидается `{''дом'': 2, ''лес'': 1}`. Для пустой строки — `{}`. Если нужны только разные слова, выбери `set`; если число повторений — `dict`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4f32bf4143a1d9ed','tuples-dicts-sets',NULL,NULL,'Задание 1. Координаты','code','Создай кортеж с координатами `x` и `y`, распакуй его в две переменные и выведи каждую координату.

Для каждого задания выбери коллекцию и объясни выбор, предскажи результат, а затем запускай код. При ошибке проверь скобки, кавычки, двоеточия и отступы.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b5fd08acf1c45c0f','tuples-dicts-sets',NULL,NULL,'Задание 2. Словарь оценок','code','Создай словарь с тремя именами и оценками. Выведи имя и оценку каждого ученика. Измени одну оценку и добавь ещё одного ученика.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ba3272c3334db57e','tuples-dicts-sets',NULL,NULL,'Задание 3. Уникальные слова','code','Дан список слов с повторами. Получи множество уникальных слов и проверь, есть ли в нём слово `"Python"`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a55fb74730ed4275','tuples-dicts-sets',NULL,NULL,'Задание 4. Общие увлечения','code','Даны два множества друзей: кто ходит на рисование и кто ходит на шахматы. Выведи:

- тех, кто ходит на оба занятия;
- тех, кто ходит хотя бы на одно;
- тех, кто ходит на рисование, но не на шахматы.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e102af4658b8064c','tuples-dicts-sets',NULL,NULL,'Полка фильмов · обязательная','code','**Сюжет.** Киноклуб хранит неизменяемую четвёрку названий.

**Условие.** Прочитайте четыре названия, создайте кортеж и выведите первое и последнее.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Четыре строки. | Два названия на отдельных строках. |

**Ограничения.** Названия непустые, до 80 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>А<br>Б<br>В<br>Г</pre> | <pre>А<br>Г</pre> |
| <pre>Кот<br>Кот<br>Кот<br>Кот</pre> | <pre>Кот<br>Кот</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-68bab1495d1097d6','tuples-dicts-sets',NULL,NULL,'Паспорт питомца · обязательная','code','**Сюжет.** Приют собирает имя, вид и возраст питомца в одной записи.

**Условие.** Создайте словарь с ключами name, species, age и выведите карточку.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки: имя, вид, целый возраст. | Строки «Имя: ...», «Вид: ...», «Возраст: ...». |

**Ограничения.** Имя/вид непустые до 40 символов; 0 ≤ возраст ≤ 30.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Барсик<br>кот<br>2</pre> | <pre>Имя: Барсик<br>Вид: кот<br>Возраст: 2</pre> |
| <pre>Луч<br>пёс<br>0</pre> | <pre>Имя: Луч<br>Вид: пёс<br>Возраст: 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7815eb6b12db950c','tuples-dicts-sets',NULL,NULL,'Уникальные жетоны · обязательная','code','**Сюжет.** Сканер несколько раз считывает одни и те же номера.

**Условие.** Посчитайте число различных номеров.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n целых чисел по одному на строку. | Одно целое количество. |

**Ограничения.** 0 ≤ n ≤ 100; 0 ≤ номер ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>3<br>3<br>1<br>3</pre> | <pre>2</pre> |
| <pre>0</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1ba9bef93480388c','tuples-dicts-sets',NULL,NULL,'Список гостей · повторение','code','**Сюжет.** Организатор получил имена через запятые, некоторые повторяются.

**Условие.** Уберите пробелы по краям имён, исключите повторы и выведите число разных гостей. Регистр важен.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка, либо пустая, либо список непустых имён через запятую. | Одно целое количество. |

**Ограничения.** До 50 имён, до 30 символов в имени; пустых элементов в непустом списке нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Аня, Миша,Аня</pre> | <pre>2</pre> |
| <em>Пустая строка (Enter)</em> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-46e347b9776f5e0c','tuples-dicts-sets',NULL,NULL,'Покупки команды · по выбору','code','**Сюжет.** Записи о товаре могут повторяться.

**Условие.** Сложите количества одинаковых товаров в словаре. Выведите товары в порядке первого появления.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем для каждой записи две строки: название, количество. | По записи «название количество» на строке; при n=0 вывод пустой. |

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

**Условие.** Выведите число общих книг и число книг, прочитанных только первым другом. Повторы в одном списке не считаются.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| n, затем n номеров первого друга; затем m и m номеров второго. Все значения на отдельных строках. | Два целых числа через пробел: общие, только у первого. |

**Ограничения.** 0 ≤ n,m ≤ 50; номера от 1 до 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>3<br>1<br>2<br>2<br>2<br>2<br>3</pre> | <pre>1 1</pre> |
| <pre>0<br>0</pre> | <pre>0 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c856d7bbad64833b','tuples-dicts-sets',NULL,NULL,'Сигналы станции · по выбору','code','**Сюжет.** Станция записывает слова с названиями сигналов.

**Условие.** Без учёта регистра посчитайте частоты слов. Выведите пары в порядке первого появления.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка слов, разделённых пробелами. | По строке «слово количество», слова в нижнем регистре; пустой ввод даёт пустой вывод. |

**Ограничения.** До 100 слов из английских букв; пустая строка допустима.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Radar lidar RADAR</pre> | <pre>radar 2<br>lidar 1</pre> |
| <em>Пустая строка (Enter)</em> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c7f6254e2fba5994','tuples-dicts-sets',NULL,NULL,'Алфавит сообщения · по выбору','code','**Сюжет.** Радиооператор считает символы в кодовом слове.

**Условие.** Постройте частоты букв и выведите буквы в порядке первого появления.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка. | По строке «буква количество»; при пустом слове вывод пустой. |

**Ограничения.** От 0 до 30 строчных латинских букв.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>banana</pre> | <pre>b 1<br>a 3<br>n 2</pre> |
| <em>Пустая строка (Enter)</em> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-38a9047924c585d7','records-practice',NULL,NULL,'Поиск участника · обязательная','code','**Сюжет.** Организатору нужно быстро проверить, записан ли участник на кружок.

**Условие.** Напиши функцию `find_student(students, student_id)`. Она возвращает словарь записи с таким `id`. Если участника нет, функция возвращает `None`. Не изменяй исходный список.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список словарей с целочисленными `id` и строковыми `name`; искомый целый `student_id`. | Словарь найденной записи либо `None`. |

**Ограничения.** `id` уникален; список содержит от 0 до 100 записей.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>find_student([{''id'': 4, ''name'': ''Лея''}, {''id'': 8, ''name'': ''Рэй''}], 8)</pre> | <pre>{''id'': 8, ''name'': ''Рэй''}</pre> |
| <pre>find_student([], 3)</pre> | <pre>None</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f98bf8a427fd6275','records-practice',NULL,NULL,'Пересчёт оценок · обязательная','code','**Сюжет.** Учитель исправляет оценку в журнале по номеру ученика.

**Условие.** Напиши `update_score(students, student_id, new_score)`. Если запись найдена, замени её `score` и верни `True`. Если нет — верни `False`. Изменение должно быть видно в исходном списке.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список словарей `{id, score}`, целые `student_id` и `new_score`. | `True`, если запись изменена; иначе `False`. |

**Ограничения.** `id` уникален; `0 ≤ new_score ≤ 100`.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>students = [{''id'': 2, ''score'': 70}]<br>update_score(students, 2, 90)<br>students</pre> | <pre>True<br>[{''id'': 2, ''score'': 90}]</pre> |
| <pre>update_score([], 5, 60)</pre> | <pre>False</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-acc724def5c260c1','records-practice',NULL,NULL,'Корзина покупок · обязательная','code','**Сюжет.** Магазину нужен итог по товарам, которые покупатель добавил в корзину.

**Условие.** Напиши функцию `cart_total(cart)`, которая возвращает сумму `price * quantity` для каждой записи корзины. Если корзина пуста, верни 0.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список словарей с целыми полями `price` и `quantity`. | Целое число — общая стоимость. |

**Ограничения.** От 0 до 50 товаров; цена и количество неотрицательны.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>cart_total([{''price'': 30, ''quantity'': 2}, {''price'': 15, ''quantity'': 1}])</pre> | <pre>75</pre> |
| <pre>cart_total([])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6c3a663ff496993e','records-practice',NULL,NULL,'Любимые жанры · повторение','code','**Сюжет.** Библиотекарь выясняет, сколько книг относится к выбранному жанру.

**Условие.** Напиши `count_genre(library, genre)`. `library` — словарь с ключом `books`, значение которого — список записей. У каждой записи есть список строк `genres`. Верни количество книг, в которых жанр встречается хотя бы один раз.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Словарь `library` со списком словарей в `books`; строка `genre`. | Неотрицательное целое количество книг. |

**Ограничения.** В одной записи жанр не повторяется; поле `books` всегда есть.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>count_genre({''books'': [{''genres'': [''сказка'', ''драма'']}, {''genres'': [''драма'']}]}, ''драма'')</pre> | <pre>2</pre> |
| <pre>count_genre({''books'': []}, ''драма'')</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bb02a15fb6abaf12','iterators-generators',NULL,NULL,'Очередь результатов · обязательная','code','**Сюжет.** Прибор выдаёт квадраты по запросу и не начинает очередь заново.

**Условие.** Создайте генератор квадратов чисел 1…n; получите первый элемент через next с запасным значением None. Выведите первый результат, остаток списком и результат повторного list на том же генераторе.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Аргумент n для функции consume_squares(n), которая возвращает кортеж из трёх результатов. input не требуется. | Возвращаемое значение: (первый элемент или None, список остатка, пустой список). |

**Ограничения.** 0 ≤ n ≤ 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>consume_squares(3)</pre> | <pre>(1, [4, 9], [])</pre> |
| <pre>consume_squares(0)</pre> | <pre>(None, [], [])</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-31975a3676b82da2','iterators-generators',NULL,NULL,'Два подсчёта · обязательная','code','**Сюжет.** Аналитик дважды запрашивает сумму одной и той же очереди квадратов.

**Условие.** Функция square_sums(n) создаёт один генератор 1²…n² и возвращает сумму первого и второго проходов по нему.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Целый аргумент n; без input. | Кортеж (первая сумма, вторая сумма). |

**Ограничения.** 0 ≤ n ≤ 20.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>square_sums(4)</pre> | <pre>(30, 0)</pre> |
| <pre>square_sums(0)</pre> | <pre>(0, 0)</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e21977a0bb048934','iterators-generators',NULL,NULL,'Оценки напротив имён · обязательная','code','**Сюжет.** Сервис соединяет имена и оценки по порядку.

**Условие.** pair_scores(names, scores) возвращает list(zip(names, scores)). Если длины различаются, верните также текст «Неполные данные», иначе «Полные данные».

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Два списка аргументов; элементы names — строки, scores — целые числа. | Кортеж из списка пар и строки статуса. В этой задаче сокращение zip намеренно допускается. |

**Ограничения.** До 10 элементов в каждом списке; имена непустые.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>pair_scores([''Аня'', ''Борис''], [5])</pre> | <pre>([(''Аня'', 5)], ''Неполные данные'')</pre> |
| <pre>pair_scores([], [])</pre> | <pre>([], ''Полные данные'')</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-099a177c302fd9c3','iterators-generators',NULL,NULL,'Допуск оценок · повторение','code','**Сюжет.** Электронный журнал принимает непустую последовательность оценок от 2 до 5.

**Условие.** Функция valid_scores(scores) возвращает True, только если список непустой и все значения в диапазоне.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список целых чисел — аргумент функции. | Логическое возвращаемое значение. |

**Ограничения.** До 30 элементов; числа от −10 до 10.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>valid_scores([2, 5])</pre> | <pre>True</pre> |
| <pre>valid_scores([])</pre> | <pre>False</pre> |
| <pre>valid_scores([1, 5])</pre> | <pre>False</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0f79f8f8589132be','text-bytes-utf8',NULL,NULL,'Закодируй фразу с именем ученика в UTF-8, выведи длину строки и байтов, затем восстанови строку через decode.','code','Закодируй фразу с именем ученика в UTF-8, выведи длину строки и байтов, затем восстанови строку через decode. Сверь, что восстановленный текст совпадает с исходным. Отдельно проверь байты ASCII-строки и кириллической строки.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d8f3fad7894f1efd','text-bytes-utf8',NULL,NULL,'Письмо, которое потерялось · обязательная','code','**Сюжет.** Робот получил текстовое сообщение как байты и должен показать его человеку.

**Условие.** Функция restore_message(data) декодирует байты data как UTF-8 и возвращает строку. Если данные некорректны, функция должна позволить возникнуть UnicodeDecodeError, не заменяя байты молча.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Один объект bytes, содержащий корректный UTF-8. | Строка типа str с восстановленным текстом. |

**Ограничения.** В основном тесте передаются корректные UTF-8-байты. Отдельно проверь некорректные байты и запиши имя возникшего исключения.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>restore_message("Привет".encode("utf-8"))</pre> | <pre>Привет</pre> |
| <pre>restore_message(b"Python")</pre> | <pre>Python</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9923462c16c80015','text-bytes-utf8',NULL,NULL,'Размер послания · обязательная','code','**Сюжет.** Почтовый робот должен узнать, сколько места займёт текстовое сообщение при отправке.

**Условие.** Напиши функцию `utf8_size(text)`, которая возвращает число байтов в строке при кодировании UTF-8. Исходную строку не меняй.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Один аргумент `text`: строка Python. | Целое число байтов UTF-8. |

**Ограничения.** Длина строки — от 0 до 100 символов; разрешены латинские и кириллические буквы, пробелы и цифры.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>utf8_size("Aя")</pre> | <pre>3</pre> |
| <pre>utf8_size("")</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9965d84ed57ee85a','text-bytes-utf8',NULL,NULL,'Повреждённая записка · обязательная','code','**Сюжет.** Архивариус получает байты из старого устройства. Иногда текст повреждён, и программа должна сообщить об этом без аварийного завершения.

**Условие.** Напиши функцию `safe_decode(data)`. Для корректного UTF-8 верни кортеж `(True, текст)`. Если возникает `UnicodeDecodeError`, верни `(False, "")`. Другие ошибки не перехватывай.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Один аргумент `data`: объект `bytes`. | Кортеж из логического значения и строки; для некорректных байтов — `(False, "")`. |

**Ограничения.** Длина данных — до 1000 байтов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>safe_decode("Привет".encode("utf-8"))</pre> | <pre>(True, ''Привет'')</pre> |
| <pre>safe_decode(bytes([255]))</pre> | <pre>(False, '''')</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8aa0f4094e1d3880','text-bytes-utf8',NULL,NULL,'Архив коротких сообщений · повторение','code','**Сюжет.** Робот передаёт несколько коротких сообщений одним байтовым блоком и затем восстанавливает их.

**Условие.** Напиши функцию `pack_messages(messages)`, которая объединяет непустые строки одним символом перевода строки и кодирует результат в UTF-8. Пустые строки в списке пропускаются. Функция возвращает `bytes`; исходный список не меняет.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Один аргумент `messages`: список строк. | Один объект `bytes`, содержащий оставшиеся сообщения через перевод строки в UTF-8. |

**Ограничения.** От 0 до 100 строк; каждая строка не содержит переводов строки.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>pack_messages(["Привет", "", "Python"])</pre> | <pre>b''Привет\nPython''</pre> |
| <pre>pack_messages([])</pre> | <pre>b''''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5fb04f1040f3db45','functions-modules',NULL,NULL,'Добавь в show_menu() ещё один пункт.','code','Добавь в `show_menu()` ещё один пункт. Вызови функцию второй раз в конце ячейки.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-14b22c94ed334f52','functions-modules',NULL,NULL,'Создай функцию show_difference(first, second), которая печатает разность first - second.','code','Создай функцию `show_difference(first, second)`, которая печатает разность `first - second`. Проверь на двух парах чисел.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5cf405d4fe72d614','functions-modules',NULL,NULL,'Напиши multiply(first, second), которая возвращает произведение.','code','Напиши `multiply(first, second)`, которая возвращает произведение. Сохрани результат в переменную и выведи сообщение с f-строкой.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-53bd103214a30647','functions-modules',NULL,NULL,'Напиши count_even(numbers), которая возвращает число чётных элементов и ничего не печатает.','code','Напиши `count_even(numbers)`, которая возвращает число чётных элементов и ничего не печатает. Для `[1, 2, 4]` ожидается 2, для `[]` — 0. Вывод добавь отдельно, после вызова функции.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c2ce8432354dcd3a','functions-modules',NULL,NULL,'Добавь ветку elif, чтобы отдельно описать возраст 13 лет.','code','Добавь ветку `elif`, чтобы отдельно описать возраст 13 лет. Выбери порядок условий так, чтобы каждое значение попадало в нужную ветку.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dacc81f60cb7782d','functions-modules',NULL,NULL,'Измени список и проверь подсчёт.','code','Измени список и проверь подсчёт. Измени условие так, чтобы считать оценки меньше четырёх.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fba4b9ece58a1099','functions-modules',NULL,NULL,'Измени условие на number % 2 == 0, чтобы функция собирала чётные числа.','code','Измени условие на `number % 2 == 0`, чтобы функция собирала чётные числа. Для нуля это условие тоже верно.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5f00e683c0e07786','functions-modules',NULL,NULL,'Добавь ученика в список и ещё одно слово.','code','Добавь ученика в список и ещё одно слово. Поменяй минимальную длину в вызове `count_long_words()`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-3a190d127f954a1a','functions-modules',NULL,NULL,'Задание 1. Приветствие','code','Создай функцию `welcome()`, которая печатает две строки: приветствие и напоминание повторить код. Вызови её два раза.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9c889f322a95efe2','functions-modules',NULL,NULL,'Задание 2. Прямоугольник из символов','code','Создай функцию с параметрами `symbol` и `count`. Она должна напечатать символ `count` раз. Используй цикл `for` или умножение строки на число.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4a6818352f179176','functions-modules',NULL,NULL,'Задание 3. Больше ли число?','code','Создай функцию `is_bigger(number, border)`, которая возвращает `True`, если число больше границы, и `False` в противном случае. Используй её результат в `if`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-515f971dead5a4d3','functions-modules',NULL,NULL,'Задание 4. Сумма списка','code','Напиши функцию, которая принимает список чисел и возвращает их сумму. Не используй `sum()`: заведи переменную-сумму и сложи элементы циклом `for`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-22bc1c4d86d8d366','functions-modules',NULL,NULL,'Задание 5. Перенеси функции в модуль','code','Создай в `student_tools.py` две функции из предыдущих заданий. Импортируй их в ноутбук и проверь на новых значениях.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-11b6b3cd7fc7b4ba','functions-modules',NULL,NULL,'Заставка клуба · обязательная','code','**Сюжет.** Терминал клуба показывает неизменную заставку.

**Условие.** Напишите show_title() без параметров: она печатает «Клуб исследователей». Вызовите дважды.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Два последовательных вызова show_title(); input не нужен. | Каждый вызов печатает одну строку. |

**Ограничения.** Функция не принимает аргументы и возвращает None.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>show_title(); show_title()</pre> | <pre>Клуб исследователей<br>Клуб исследователей</pre> |
| <pre>show_title()</pre> | <pre>Клуб исследователей</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b1571abfe82cef85','functions-modules',NULL,NULL,'Меню терминала · обязательная','code','**Сюжет.** Посетитель выбирает действие по текстовому меню.

**Условие.** show_menu() печатает три строки: «1. Каталог», «2. Помощь», «3. Выход».

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Вызов функции без аргументов. | Три строки текста. |

**Ограничения.** Меню не спрашивает выбор и не запускает другие действия.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>show_menu()</pre> | <pre>1. Каталог<br>2. Помощь<br>3. Выход</pre> |
| <pre>Повторный show_menu()</pre> | <pre>1. Каталог<br>2. Помощь<br>3. Выход</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ce88c04ad5c7c86b','functions-modules',NULL,NULL,'Приветствие участника · обязательная','code','**Сюжет.** Организатор готовит персональное приветствие.

**Условие.** greet(name) возвращает строку «Привет, ИМЯ!», не печатая её.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Аргумент name — непустая строка. | Возвращаемая строка. |

**Ограничения.** От 1 до 40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>greet(''Аня'')</pre> | <pre>''Привет, Аня!''</pre> |
| <pre>greet(''Ян'')</pre> | <pre>''Привет, Ян!''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4b8f850e96221277','functions-modules',NULL,NULL,'Экран из звёзд · повторение','code','**Сюжет.** На табло нужна прямоугольная заставка.

**Условие.** show_rectangle(width, height) печатает прямоугольник из *. Используйте вложенные циклы.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Два целых аргумента: ширина и высота. | height строк шириной width. При нулевой высоте вывод пустой; при нулевой ширине строки пустые. |

**Ограничения.** 0 ≤ width,height ≤ 10; тему вложенных циклов нужно пройти до этой задачи.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>show_rectangle(3, 2)</pre> | <pre>***<br>***</pre> |
| <pre>show_rectangle(3, 0)</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bccacb2bdc26e0c6','functions-modules',NULL,NULL,'Карточка занятия · по выбору','code','**Сюжет.** Учебный сервис собирает имя ученика и предмет.

**Условие.** lesson_card(name, subject) возвращает строку «ИМЯ изучает ПРЕДМЕТ».

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две непустые строки-аргумента. | Возвращаемая строка. |

**Ограничения.** До 40 символов в каждой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>lesson_card(''Миша'', ''Python'')</pre> | <pre>''Миша изучает Python''</pre> |
| <pre>lesson_card(''Аня'', ''математику'')</pre> | <pre>''Аня изучает математику''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-789b60c2d7bc0340','functions-modules',NULL,NULL,'Площадь участка · по выбору','code','**Сюжет.** Квадратный участок описывается длиной стороны.

**Условие.** square(side) возвращает квадрат стороны. Результат вызова используйте в f-строке «Площадь: X» при демонстрации.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Целый аргумент side. | Функция возвращает целое число; в таблице приведены возвращаемые значения. |

**Ограничения.** 0 ≤ side ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>square(4)</pre> | <pre>16</pre> |
| <pre>square(0)</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-84a4fdddbbcfacc6','functions-modules',NULL,NULL,'Парные наборы · по выбору','code','**Сюжет.** Склад хочет узнать, делится ли число изделий на пары.

**Условие.** is_even(number) возвращает True для чётного целого, иначе False. Ноль считается чётным.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Целый аргумент number. | Логическое значение. |

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

**Условие.** make_full_name(first_name, last_name) возвращает имя, пробел и фамилию.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Две непустые строки-аргумента, без пробелов по краям. | Возвращаемая строка. |

**Ограничения.** До 40 символов в каждой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>make_full_name(''Аня'', ''Иванова'')</pre> | <pre>''Аня Иванова''</pre> |
| <pre>make_full_name(''Ян'', ''Ли'')</pre> | <pre>''Ян Ли''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-394d1f99f8c40a0f','functions-modules',NULL,NULL,'Режим теплицы · по выбору','code','**Сюжет.** До десяти градусов теплица работает в холодном режиме.

**Условие.** describe_temperature(temp) возвращает «холодно», если температура меньше 10, иначе «тепло».

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Целый аргумент temp. | Возвращаемая строка. |

**Ограничения.** −50 ≤ temp ≤ 50.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>describe_temperature(9)</pre> | <pre>''холодно''</pre> |
| <pre>describe_temperature(10)</pre> | <pre>''тепло''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-708ae40bee73a628','functions-modules',NULL,NULL,'Короткие подписи · по выбору','code','**Сюжет.** На компактную этикетку помещаются слова короче пяти букв.

**Условие.** count_short_words(words) возвращает количество подходящих слов. Пустые строки допустимы и считаются короткими.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список строк — аргумент функции. | Целое число. Исходный список не изменяется. |

**Ограничения.** До 50 строк, до 30 символов в каждой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>count_short_words([''кот'', ''компас'', ''''])</pre> | <pre>2</pre> |
| <pre>count_short_words([])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f64b846501481ffb','functions-modules',NULL,NULL,'Выборка номеров · по выбору','code','**Сюжет.** Из списка номеров нужно получить отдельный список чётных.

**Условие.** get_even_numbers(numbers) возвращает новый список чётных значений в исходном порядке; исходный список сохраняется.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список целых чисел. | Новый список, в том числе отдельный пустой при отсутствии элементов. |

**Ограничения.** До 100 элементов от −100 до 100; повторы разрешены.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>get_even_numbers([1, 2, 0, -4])</pre> | <pre>[2, 0, -4]</pre> |
| <pre>get_even_numbers([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2bb9230bdc9d9f4f','functions-modules',NULL,NULL,'Лучший результат · по выбору','code','**Сюжет.** Тренер выбирает самый высокий результат команды, в том числе при отрицательных значениях.

**Условие.** best_result(numbers) возвращает максимум непустого списка. Используйте цикл и сравнения без max.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Непустой список целых чисел. | Одно возвращаемое целое число. |

**Ограничения.** 1–100 элементов от −1000 до 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>best_result([-5, -2, -9])</pre> | <pre>-2</pre> |
| <pre>best_result([7])</pre> | <pre>7</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a24417d5bccbbbb0','functions-modules',NULL,NULL,'Список на букву а · по выбору','code','**Сюжет.** Указатель выбирает названия, начинающиеся со строчной кириллической «а».

**Условие.** starts_with_a(words) возвращает новый список подходящих строк. Пустая строка не подходит; регистр важен.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список строк. | Список строк в исходном порядке. |

**Ограничения.** До 30 строк длиной 0–40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>starts_with_a([''арбуз'', '''', ''Атлас'', ''апельсин''])</pre> | <pre>[''арбуз'', ''апельсин'']</pre> |
| <pre>starts_with_a([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-050a48ae366d8cd1','functions-modules',NULL,NULL,'Отчёт в модуле · по выбору','code','**Сюжет.** Журнал повторно использует одну функцию в разных программах.

**Условие.** Создайте student_report.py с make_report(name, scores), возвращающей три строки: имя, количество оценок, число пятёрок. Импортируйте её в ячейке блокнота; модуль при импорте не должен печатать текст.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Имя и список оценок — аргументы функции; модуль лежит рядом с рабочим блокнотом. | Возвращаемая строка без перевода строки в конце. В таблице показан её текст, а не repr. |

**Ограничения.** Имя непустое; до 30 целых оценок от 2 до 5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>make_report(''Аня'', [5, 4, 5])</pre> | <pre>Имя: Аня<br>Оценок: 3<br>Пятёрок: 2</pre> |
| <pre>make_report(''Миша'', [])</pre> | <pre>Имя: Миша<br>Оценок: 0<br>Пятёрок: 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-15c2b37810681934','function-arguments-scope',NULL,NULL,'Напиши функцию, возвращающую новый список с добавленным предметом.','code','Напиши функцию, возвращающую новый список с добавленным предметом. После вызова исходный список должен остаться прежним. Используй `.copy()` и `return`; проверь также пустой список.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cb1a0f013b2fb5cd','function-arguments-scope',NULL,NULL,'Задание 1. Площадь прямоугольника','code','Напиши функцию `rectangle_area(width, height)`, которая возвращает площадь. Добавь аннотации типов и docstring. Проверь функцию для двух разных прямоугольников.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-110a4f54edc37ccb','function-arguments-scope',NULL,NULL,'Задание 2. Приветствие с настройкой','code','Напиши функцию `greet(name, greeting="Привет")`. Она должна возвращать приветствие. Проверь вызов со значением по умолчанию и с другим приветствием.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0202829cdcabae5e','function-arguments-scope',NULL,NULL,'Задание 3. Среднее значение','code','Напиши функцию `average(*numbers)`, которая возвращает среднее арифметическое переданных чисел. Подумай, что вернуть, если чисел нет.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-41268a007728690b','function-arguments-scope',NULL,NULL,'Задание 4. Карточка ученика','code','Напиши функцию `print_student(name, **details)`. Она должна вывести имя ученика, а затем все дополнительные сведения из словаря `details`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-61aed5fa9ea1b98c','function-arguments-scope',NULL,NULL,'Ценник магазина · обязательная','code','**Сюжет.** Одинаковая функция печати цены должна поддерживать разные валюты.

**Условие.** format_price(price, currency="₽") возвращает строку с двумя знаками после точки и валютой через пробел. Добавьте docstring и аннотации типов.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| price — int или float, currency — непустая строка; параметры можно передать по имени. | Возвращаемая строка, input и print внутри функции не нужны. |

**Ограничения.** 0 ≤ price ≤ 1000000; currency до 10 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>format_price(12)</pre> | <pre>''12.00 ₽''</pre> |
| <pre>format_price(currency=''EUR'', price=2.5)</pre> | <pre>''2.50 EUR''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5209441a17b02192','function-arguments-scope',NULL,NULL,'Кассовый расчёт · обязательная','code','**Сюжет.** Касса поддерживает сложение и вычитание двух целых сумм.

**Условие.** calculate(a, b, *, operation="сложение") возвращает a+b либо a−b для operation="вычитание". Параметр operation только именованный.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Два целых аргумента и необязательный именованный operation. | Возвращаемое целое число. |

**Ограничения.** −1000 ≤ a,b ≤ 1000; допустимы только две указанные операции.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>calculate(7, 3)</pre> | <pre>10</pre> |
| <pre>calculate(7, 3, operation=''вычитание'')</pre> | <pre>4</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-76d349d461531574','function-arguments-scope',NULL,NULL,'Самая длинная подпись · обязательная','code','**Сюжет.** Дизайнер передаёт функции произвольное число подписей.

**Условие.** find_longest_word(*words) возвращает первую из самых длинных строк. При отсутствии аргументов возвращает пустую строку.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Позиционные аргументы-строки. | Возвращаемая строка. |

**Ограничения.** От 0 до 20 строк длиной до 40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>find_longest_word(''кот'', ''дом'', ''а'')</pre> | <pre>''кот''</pre> |
| <pre>find_longest_word()</pre> | <pre>''''</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7f60d1dbe2836259','function-arguments-scope',NULL,NULL,'Паспорт экспоната · повторение','code','**Сюжет.** У каждого экспоната может быть свой набор характеристик.

**Условие.** describe(title, **features) возвращает заголовок, затем строки «ключ: значение» в порядке передачи характеристик.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Непустой title и дополнительные именованные значения-строки. | Одна строка с переводами строк внутри; последнего перевода строки нет. |

**Ограничения.** До 10 характеристик; ключи — латинские идентификаторы, строки без переводов строк.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>describe(''Компас'', color=''синий'', year=''2026'')</pre> | <pre>Компас<br>color: синий<br>year: 2026</pre> |
| <pre>describe(''Карта'')</pre> | <pre>Карта</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b9140958379ce061','function-arguments-scope',NULL,NULL,'Пароль хранилища · по выбору','code','**Сюжет.** Хранилищу нужен пароль минимум из восьми символов с хотя бы одной ASCII-цифрой.

**Условие.** valid_password(password) возвращает True при выполнении обоих требований. Остальные символы разрешены.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Аргумент-строка. | Логическое значение. |

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

**Условие.** double_values(values) возвращает новый список удвоенных чисел. Исходник не меняется. Добавьте docstring и аннотации.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список целых чисел — аргумент. | Новый список. Повторные вызовы независимы. |

**Ограничения.** До 100 элементов от −100 до 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>double_values([1, -2, 0])</pre> | <pre>[2, -4, 0]</pre> |
| <pre>double_values([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4d2282a339848101','function-arguments-scope',NULL,NULL,'История запросов · по выбору','code','**Сюжет.** У каждого нового запроса без переданной истории должна быть собственная запись.

**Условие.** remember(item, history=None) возвращает список с добавленным item. Если history передан, изменяет и возвращает именно этот список; если нет — создаёт новый.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| item — строка; history — список строк или None. | Список истории; два вызова без history не должны делить общий список. |

**Ограничения.** До 30 записей; строки до 40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>remember(''А''); remember(''Б'')</pre> | <pre>Первый результат: [''А'']; второй: [''Б'']</pre> |
| <pre>items = [''А'']; remember(''Б'', items)</pre> | <pre>Результат и items: [''А'', ''Б'']; это один объект</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a530f77a159646ba','sorting-callbacks',NULL,NULL,'Практика перед выполнением ДЗ','text','Перед сортировкой письменно ответь: что является одним элементом? Какой ключ вернёт функция для него? Что происходит при равенстве ключей?',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-3db9aab5aac9b8e5','sorting-callbacks',NULL,NULL,'Короткие названия · обязательная','code','**Сюжет.** Редактор списка вывесок хочет сначала показать самые короткие названия.

**Условие.** Напиши `sort_by_length(words)`, которая возвращает новый список слов в порядке увеличения длины. Если длины совпали, слова должны идти в исходном взаимном порядке. Исходный список не меняй.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список строк `words`. | Новый список строк, отсортированный по длине. |

**Ограничения.** От 0 до 100 строк; строка может быть пустой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>sort_by_length([''лиса'', ''кот'', ''дом''])</pre> | <pre>[''кот'', ''дом'', ''лиса'']</pre> |
| <pre>sort_by_length([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e0338140200b0811','sorting-callbacks',NULL,NULL,'Рейтинг игроков · обязательная','code','**Сюжет.** После турнира ведущий публикует список участников по убыванию баллов.

**Условие.** Напиши `rank_players(players)`. Верни новый список записей по убыванию `score`. При равных баллах порядок игроков из исходных данных сохраняется.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список словарей с полями `name` (строка) и `score` (целое). | Новый список словарей в порядке рейтинга. |

**Ограничения.** От 0 до 100 игроков; имена могут повторяться; баллы от 0 до 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>rank_players([{''name'': ''Ли'', ''score'': 7}, {''name'': ''Мэй'', ''score'': 9}, {''name'': ''Бо'', ''score'': 7}])</pre> | <pre>[{''name'': ''Мэй'', ''score'': 9}, {''name'': ''Ли'', ''score'': 7}, {''name'': ''Бо'', ''score'': 7}]</pre> |
| <pre>rank_players([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-01f5041e174b58fe','sorting-callbacks',NULL,NULL,'Каталог кружков · обязательная','code','**Сюжет.** Секретарь школы сортирует кружки по дню недели, а внутри одного дня — по названию.

**Условие.** Напиши `sort_clubs(clubs)`, которая возвращает новый список записей по порядку дней недели: понедельник, вторник, среда, четверг, пятница; внутри дня — по алфавиту `name`. Для сравнения дня используй список `day_order = ["понедельник", "вторник", "среда", "четверг", "пятница"]`. Исходный список не меняй.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список словарей `{day, name}`; `day` — одна из пяти строк `day_order`. | Новый список записей, отсортированный по дню и названию. |

**Ограничения.** Не более 50 кружков; названия непустые; регистр учитывается обычным образом Python.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>sort_clubs([{''day'': ''вторник'', ''name'': ''Звук''}, {''day'': ''понедельник'', ''name'': ''Роботы''}, {''day'': ''понедельник'', ''name'': ''Арт''}])</pre> | <pre>[{''day'': ''понедельник'', ''name'': ''Арт''}, {''day'': ''понедельник'', ''name'': ''Роботы''}, {''day'': ''вторник'', ''name'': ''Звук''}]</pre> |
| <pre>sort_clubs([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-96e2d8d76f6f98ef','sorting-callbacks',NULL,NULL,'Сроки сдачи · повторение','code','**Сюжет.** Классный руководитель сортирует список дел по оставшимся дням.

**Условие.** Напиши `urgent_tasks(tasks)`, возвращающую новый список названий задач с количеством дней `days` меньше либо равным `limit`. Сохрани исходный порядок выбранных задач.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список словарей `{name, days}` и целое `limit`. | Список строк `name` для задач, срок которых не превышает `limit`. |

**Ограничения.** Список может быть пустым; `days` и `limit` неотрицательны.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>urgent_tasks([{''name'': ''Плакат'', ''days'': 2}, {''name'': ''Доклад'', ''days'': 5}], 2)</pre> | <pre>[''Плакат'']</pre> |
| <pre>urgent_tasks([], 0)</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-62c510a36b70e810','oop-basics',NULL,NULL,'Создай третий объект hero3 с собственным именем и здоровьем.','code','Создай третий объект `hero3` с собственным именем и здоровьем.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f678ae85565b601d','oop-basics',NULL,NULL,'Добавь атрибут level в __init__, передай уровень при создании двух героев и выведи его.','code','Добавь атрибут `level` в `__init__`, передай уровень при создании двух героев и выведи его.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ab0cd5fde096b350','oop-basics',NULL,NULL,'Практика: Объектно-ориентированное программирование · 2','code','Добавь метод `status()`, который возвращает строку `"Готов к игре"`, если здоровье больше нуля, и `"Нужна помощь"` в противном случае.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-17818009e00b3dec','oop-basics',NULL,NULL,'Добавь в класс метод add_item(self, item), который добавляет предмет в self.items через append().','code','Добавь в класс метод `add_item(self, item)`, который добавляет предмет в `self.items` через `append()`. Вызови метод для одного героя и проверь список методом `show_items()`.

Пример вызова должен выглядеть так: `hero2.add_item("карта")`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-42f501e6da6382fd','oop-basics',NULL,NULL,'Журнал ученика · обязательная','code','**Сюжет.** Электронный журнал хранит отдельную оценку каждого ученика.

**Условие.** Создайте Student(name, grade), метод show_info() печатает «ИМЯ: ОЦЕНКА», change_grade(new_grade) меняет только текущего ученика.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Создание объектов и вызовы методов из примеров; input не нужен. | Вывод show_info(); данные одного объекта не влияют на другой. |

**Ограничения.** Имя непустое; оценки целые от 2 до 5. Методы изменения возвращают None.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>a = Student(''Аня'', 4); b = Student(''Миша'', 3); a.change_grade(5); a.show_info(); b.show_info()</pre> | <pre>Аня: 5<br>Миша: 3</pre> |
| <pre>a = Student(''Ян'', 2); a.show_info()</pre> | <pre>Ян: 2</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2e85c372b1fc9869','oop-basics',NULL,NULL,'Баллы игроков · обязательная','code','**Сюжет.** В игре каждому участнику начисляют собственные баллы.

**Условие.** Player(name, score=0) хранит имя и баллы; add_points(amount) прибавляет баллы данному объекту.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Создание объектов и вызовы; после них напечатайте name и score через пробел. | Одна строка на игрока в порядке создания. |

**Ограничения.** 0 ≤ исходные баллы ≤ 1000; 1 ≤ amount ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>a = Player(''Аня'', 10); b = Player(''Миша'', 7); a.add_points(3)</pre> | <pre>Аня 13<br>Миша 7</pre> |
| <pre>a = Player(''Ян''); a.add_points(1)</pre> | <pre>Ян 1</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1e249f80787d5802','oop-basics',NULL,NULL,'Игра с питомцем · обязательная','code','**Сюжет.** У каждого питомца есть запас энергии для игр.

**Условие.** Pet(name, energy) и play(amount) уменьшают энергию, но не ниже нуля. has_energy() возвращает, осталась ли энергия.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Начальная энергия и затраты целые. | В примерах показаны energy и результат has_energy() после вызовов. |

**Ограничения.** 0 ≤ energy ≤ 100; 0 ≤ amount ≤ 100; name непустой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>p = Pet(''Кот'', 5); p.play(8); print(p.energy, p.has_energy())</pre> | <pre>0 False</pre> |
| <pre>p = Pet(''Кот'', 5); p.play(2); print(p.energy, p.has_energy())</pre> | <pre>3 True</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0d847b1dc3a09e20','oop-basics',NULL,NULL,'Перекличка класса · повторение','code','**Сюжет.** Учитель хранит несколько учеников в одном списке.

**Условие.** Используйте Student из первой задачи. Создайте список по записям и вызовите show_info() у каждого через цикл.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Аргумент records — список пар (имя, оценка) для функции print_class(records). | Карточки по одной на строке, порядок сохраняется; пустой список даёт пустой вывод. |

**Ограничения.** До 30 записей; оценки 2–5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>print_class([(''Аня'', 5), (''Ян'', 4)])</pre> | <pre>Аня: 5<br>Ян: 4</pre> |
| <pre>print_class([])</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a2d182603290a17a','oop-basics',NULL,NULL,'Лечение героя · по выбору','code','**Сюжет.** Здоровье героя не должно превышать максимальный запас.

**Условие.** Создайте Hero(name, health, max_health) и heal(amount). Метод увеличивает здоровье до max_health, но не выше.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Параметры конструктора и вызов heal. | В примерах выводится атрибут health после лечения. |

**Ограничения.** 0 ≤ health ≤ max_health ≤ 1000; amount ≥ 0.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>h = Hero(''Луч'', 8, 10); h.heal(5); print(h.health)</pre> | <pre>10</pre> |
| <pre>h = Hero(''Луч'', 0, 10); h.heal(3); print(h.health)</pre> | <pre>3</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bc2b6ed47b9d5a50','oop-basics',NULL,NULL,'Чтение книги · по выбору','code','**Сюжет.** Приложение считает непрочитанные страницы каждой книги.

**Условие.** Book(title, pages) хранит remaining=pages. read(pages) уменьшает remaining, но не ниже нуля; две книги независимы.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Создание книги и вызовы read. | В таблице показано remaining после чтения. |

**Ограничения.** Название непустое; 0 ≤ начальные pages ≤ 10000; за один вызов читают неотрицательное целое число страниц.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>b = Book(''Карта'', 10); b.read(3); b.read(20); print(b.remaining)</pre> | <pre>0</pre> |
| <pre>b = Book(''Атлас'', 10); b.read(0); print(b.remaining)</pre> | <pre>10</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0b464cc57d7b8ef7','oop-basics',NULL,NULL,'Готовые к игре · по выбору','code','**Сюжет.** Приют показывает имена питомцев, у которых ещё есть энергия.

**Условие.** Используйте Pet из третьей задачи. active_pets(pets) возвращает список имён с положительной энергией.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список объектов Pet. | Новый список имён; объекты не меняются. |

**Ограничения.** До 20 объектов; порядок сохраняется.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>active_pets([Pet(''Кот'', 0), Pet(''Пёс'', 3)])</pre> | <pre>[''Пёс'']</pre> |
| <pre>active_pets([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b31b29a35c98ce38','oop-composition-inheritance',NULL,NULL,'Добавь __str__ классу Player, чтобы он возвращал Имя: N очков.','code','Добавь `__str__` классу `Player`, чтобы он возвращал `Имя: N очков`. Затем добавь `__repr__`, содержащий название класса и аргументы, нужные для описания игрока.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8276f511fd4ec002','oop-composition-inheritance',NULL,NULL,'Состав команды · обязательная','code','**Сюжет.** Тренер ведёт список участников и хочет получить общий счёт команды.

**Условие.** Создайте `Player(name, score)` и `Team(name, players)`. Метод `total_score()` возвращает сумму очков. Конструктор команды сохраняет отдельную копию контейнера списка, но не копирует объекты игроков.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Строка имени команды и список объектов `Player`. | Объект `Team`; `total_score()` возвращает целое число. |

**Ограничения.** До 20 игроков; очки неотрицательные целые. Для пустой команды сумма равна 0.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>team = Team("Комета", [Player("Мира", 5), Player("Лев", 3)])<br>team.total_score()</pre> | <pre>8</pre> |
| <pre>Team("Новая", []).total_score()</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9a48c0b76a7f186d','oop-composition-inheritance',NULL,NULL,'Безопасный кошелёк · обязательная','code','**Сюжет.** Приложение не должно разрешать снять больше денег, чем есть на счёте.

**Условие.** Создайте `Wallet(balance)`, метод `withdraw(amount)` возвращает `True` и списывает сумму при успешном снятии. Иначе возвращает `False`, не меняя баланс.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Начальный баланс и последовательность сумм для снятия. | Для каждого снятия — результат `True`/`False` и текущий баланс. |

**Ограничения.** Начальный баланс и суммы — неотрицательные целые; сумма 0 считается недопустимой.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Wallet(50); withdraw(20); withdraw(40)</pre> | <pre>True, 30<br>False, 30</pre> |
| <pre>Wallet(0); withdraw(1)</pre> | <pre>False, 0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c0383d1222f0d364','oop-composition-inheritance',NULL,NULL,'Карточка книги · обязательная','code','**Сюжет.** Библиотекарь хочет видеть короткую карточку книги и подробную запись для отладки.

**Условие.** Для `Book(title, pages)` реализуйте `__str__`, возвращающий `Название — N стр.`, и `__repr__`, возвращающий строку вида `Book(title=''...'', pages=N)`. Не вызывайте `print()` внутри специальных методов.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Название книги и целое число страниц. | `str(book)` — короткая карточка; `repr(book)` — подробное представление. |

**Ограничения.** Название непустое, страницы положительные; в названии нет кавычки `''`.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>book = Book("Маугли", 180)<br>str(book)</pre> | <pre>Маугли — 180 стр.</pre> |
| <pre>repr(book)</pre> | <pre>Book(title=''Маугли'', pages=180)</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0619d5f240627bfa','oop-composition-inheritance',NULL,NULL,'Уведомления · повторение','code','**Сюжет.** Сервис отправляет обычные сообщения и письма с адресом получателя.

**Условие.** Реализуйте базовый класс `Message(text)` с методом `deliver()`, затем `EmailMessage(text, address)`, который наследуется от `Message` и переопределяет `deliver()`. Используйте `super().__init__(text)`.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Текст сообщения; для письма — также адрес. | `Message.deliver()` возвращает `Сообщение: ТЕКСТ`; `EmailMessage.deliver()` — `Письмо для АДРЕС: ТЕКСТ`. |

**Ограничения.** Текст и адрес непустые строки.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Message("До встречи").deliver()</pre> | <pre>Сообщение: До встречи</pre> |
| <pre>EmailMessage("До встречи", "a@example.org").deliver()</pre> | <pre>Письмо для a@example.org: До встречи</pre> |

**Повторение:** классы, `self`, `__init__`, аргументы методов, строки и `return`.

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c3b7b504b655f4a7','errors-debugging',NULL,NULL,'Задание 1. Безопасное преобразование','code','Попроси пользователя ввести целое число. Перехвати `ValueError` и покажи понятную подсказку, если ввод не удалось преобразовать.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d430056eba93d1fb','errors-debugging',NULL,NULL,'Задание 2. Деление двух чисел','code','Попроси ввести делимое и делитель. Обработай отдельно неверный числовой ввод и деление на ноль. Если всё получилось, выведи частное.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6f4d3289d097e7d3','errors-debugging',NULL,NULL,'Задание 3. Найди логическую ошибку','code','Функция должна возвращать количество положительных чисел. Сейчас в ней есть ошибка: программа выполняется, но ответ неверный. Исправь её и проверь на нескольких списках.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4597626e975bc91f','errors-debugging',NULL,NULL,'Задание 4. Проверка возраста','code','Напиши функцию `check_age(age)`. Если возраст отрицательный, подними `ValueError`. Иначе верни `True`, если человеку не меньше 18 лет, и `False` в остальных случаях. Вызови функцию внутри `try` и обработай ошибку.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-2bc2418a2339d1e1','errors-debugging',NULL,NULL,'Возраст для заявки · обязательная','code','**Сюжет.** Оператор может ошибиться при вводе года рождения.

**Условие.** Прочитайте год. Если int не может преобразовать строку, выведите ошибку. Иначе выведите возраст к концу 2026 года. Повторного ввода нет.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка. | Целый возраст либо «Ошибка ввода». |

**Ограничения.** Корректное число находится в 1900…2026; остальные строки не преобразуются в int.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>2010</pre> | <pre>16</pre> |
| <pre>два</pre> | <pre>Ошибка ввода</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-48db32a56136f77f','errors-debugging',NULL,NULL,'Ячейка склада · обязательная','code','**Сюжет.** На складе хранится список ["чай", "сок", "вода"].

**Условие.** Прочитайте индекс и выведите элемент. Обработайте ValueError и IndexError разными сообщениями.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка индекса. | Название; при неверном числе «Не число»; при выходе за границы «Нет ячейки». |

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

**Условие.** Найдите имя по введённому ключу. Если ключа нет, обработайте KeyError и напечатайте отказ.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка ключа. | Имя либо «Участник не найден». |

**Ограничения.** От 0 до 20 символов; регистр важен.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>a1</pre> | <pre>Аня</pre> |
| <pre>A1</pre> | <pre>Участник не найден</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-482e23bdb191b5f3','errors-debugging',NULL,NULL,'Деление ресурса · повторение','code','**Сюжет.** Сервис не разрешает делить ресурс на ноль.

**Условие.** safe_divide(a, b) возвращает a/b. При b=0 поднимите ValueError с текстом «Нулевой делитель». Напишите отдельно демонстрацию перехвата этого исключения.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Два целых аргумента. | Функция возвращает float либо поднимает указанное исключение. Таблица описывает результат вызова, не вывод traceback. |

**Ограничения.** −100 ≤ a,b ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>safe_divide(5, 2)</pre> | <pre>2.5</pre> |
| <pre>safe_divide(1, 0)</pre> | <pre>ValueError: Нулевой делитель</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-94fe0d0eeff5c2e7','errors-debugging',NULL,NULL,'Потерянная сумма · по выбору','code','**Сюжет.** Прибор ошибочно сбрасывает накопитель на каждом измерении.

**Условие.** Исправьте total_values(values), чтобы она возвращала сумму, в том числе 0 для пустого списка. Найдите первую строку неверного изменения состояния с помощью отладчика. Исходный фрагмент:

```python
def total_values(values):
    for value in values:
        total = 0
        total += value
    return total
```

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список целых чисел — аргумент функции. | Возвращаемая сумма. При сдаче дополнительно укажите причину ошибки отдельным Markdown-комментарием. |

**Ограничения.** До 20 элементов от −100 до 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>total_values([4, 5, 3])</pre> | <pre>12</pre> |
| <pre>total_values([])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-784f9d6f82c2c852','errors-debugging',NULL,NULL,'Завершение операции · по выбору','code','**Сюжет.** Терминал всегда сообщает об окончании операции, даже если ввод неверен.

**Условие.** В try преобразуйте ввод в int; при ValueError печатайте «Ошибка», при успехе в else печатайте «Принято: N». В finally всегда печатайте «Готово».

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка. | Две строки согласно правилам. |

**Ограничения.** До 30 символов; если int может преобразовать строку, значение от −100 до 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>8</pre> | <pre>Принято: 8<br>Готово</pre> |
| <pre>восемь</pre> | <pre>Ошибка<br>Готово</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-10e255a110e0c6c2','errors-debugging',NULL,NULL,'Три вопроса · по выбору','code','**Сюжет.** Викторина задаёт три заранее известных вопроса и считает ответы.

**Условие.** Правильные ответы по порядку: «4», «python», «москва». Сравнивайте после strip/lower, пустой ответ считается неверным, но игра продолжается.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки ответов, возможно пустых. | Одна строка «Верно: K из 3». |

**Ограничения.** До 40 символов в строке.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4<br>Python<br>Москва</pre> | <pre>Верно: 3 из 3</pre> |
| <pre><br>java<br>москва</pre> | <pre>Верно: 1 из 3</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d1345a8c7c245d5f','pdb-debugger',NULL,NULL,'Найди строку, где появляется ошибка','code','Предположим, ученик случайно написал:

```python
def calculate_total(numbers):
    for number in numbers:
        total = 0
        total = total + number
    return total
```

Файл запускается, но результат неверен: `total` сбрасывается на каждом повторе. Поставь `breakpoint()` перед строкой `total = 0`, запусти функцию с `[4, 5, 3]` и сравни `total` перед каждой итерацией. Если имя ещё не создано, отладчик покажет, что оно не определено — это подсказывает, что накопитель должен появиться до цикла. Исправь программу и проверь те же входные данные.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4d53c0cade48434d','pdb-debugger',NULL,NULL,'Проследи выполнение внутри функции','code','Оставь точку остановки до вызова функции:

```python
scores = [4, 5, 3]
breakpoint()
answer = calculate_total(scores)
print(answer)
```

При остановке выполни `p scores`, затем `n`. Для входа внутрь функции используй `s` на строке вызова. Посмотри аргумент функции, её локальную переменную `total`, а затем возвращаемое значение. Обычная команда `n` выполнит функцию целиком и остановится после вызова; `s` позволяет следить за строками функции.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-775dfbe81740276f','pdb-debugger',NULL,NULL,'Разбери и исправь ошибку','code','1. Запиши входные данные, на которых результат неверен.
2. Предскажи, что должно произойти.
3. Поставь `breakpoint()` перед первым подозрительным изменением.
4. Посмотри значения переменных с помощью `p имя`.
5. Иди по строкам командой `n`; используй `s`, чтобы войти в функцию.
6. Найди первую строку, после которой состояние отличается от ожидаемого.
7. Исправь причину, запусти исходный пример и добавь ещё одну проверку.
8. Удали временные точки остановки, если они больше не нужны.

Не ставь точки остановки повсюду: лучше проверять конкретную гипотезу. Например: «Я предполагаю, что `total` обнуляется внутри цикла».',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-eac35e56cd8f8387','files-csv-json',NULL,NULL,'Запиши две строки, прочитай файл дважды в одном with, затем повтори после seek(0).','code','Запиши две строки, прочитай файл дважды в одном `with`, затем повтори после `seek(0)`. Объясни разницу. Помни: `"w"` очищает существующее содержимое уже при открытии, даже если затем ничего не записать.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9887d02ff779e965','files-csv-json',NULL,NULL,'1.','code','1. Добавь в список дел новую задачу.
2. Сохрани обновлённый список в `tasks.json`.
3. Прочитай файл ещё раз и выведи все задачи.
4. Добавь проверку на отсутствие файла при чтении.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-084cd80428380303','files-csv-json',NULL,NULL,'Библиотечный список · обязательная','code','**Сюжет.** Библиотекарь сохраняет выбранные книги между запусками.

**Условие.** Прочитайте три названия, запишите каждое отдельной строкой в books.txt, затем перечитайте файл и выведите строки с номерами.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Три строки стандартного ввода. Файл books.txt создаётся или перезаписывается в текущей рабочей папке. | Файл содержит три названия, каждое с переводом строки. В stdout — три строки «номер. название». |

**Ограничения.** Названия непустые до 80 символов; UTF-8; используйте with при записи и чтении.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Дюна<br>Хоббит<br>Солярис</pre> | <pre>1. Дюна<br>2. Хоббит<br>3. Солярис</pre> |
| <pre>А<br>Б<br>В</pre> | <pre>1. А<br>2. Б<br>3. В</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5aa5e767e2a26574','files-csv-json',NULL,NULL,'Новый участник списка · обязательная','code','**Сюжет.** К уже сохранённым книгам добавляют ещё одну, не стирая предыдущие.

**Условие.** Добавьте введённое название в books.txt через режим a. Затем выведите полное содержимое файла.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Входной books.txt и одна строка стандартного ввода с новым названием. | Дополненный файл и его текст в stdout. Не добавляйте лишние пустые строки. |

**Ограничения.** Файл существует; каждая прежняя строка, включая последнюю, заканчивается переводом строки; UTF-8.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>books.txt: Дюна<br>Новое название: Хоббит</pre> | <pre>Дюна<br>Хоббит</pre> |
| <pre>books.txt пустой<br>Новое название: Атлас</pre> | <pre>Атлас</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-e1f7c6f4b8df2c90','files-csv-json',NULL,NULL,'Дорогие товары · обязательная','code','**Сюжет.** Склад хранит цены в CSV, а покупатель задаёт порог.

**Условие.** Прочитайте products.csv через DictReader и выведите товары строго дороже порога. Строки сохраняют порядок файла.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| CSV с заголовком name,price; в stdin одно целое число — порог. | Строки «название цена» для совпадений; при отсутствии вывода нет. |

**Ограничения.** UTF-8, разделитель запятая; названия непустые без запятых; цены и порог целые от 0 до 10000. Файл может содержать только заголовок.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>products.csv:<br>name,price<br>чай,100<br>сок,150<br>Порог: 100</pre> | <pre>сок 150</pre> |
| <pre>products.csv:<br>name,price<br>Порог: 0</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4bfaa9c59ae22f31','files-csv-json',NULL,NULL,'Настройки игры · повторение','code','**Сюжет.** Игра хранит громкость и имя игрока в JSON.

**Условие.** Прочитайте settings.json, измените только volume на значение из stdin и сохраните JSON обратно.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| JSON-объект с name и volume; затем целая громкость в stdin. | Обновлённый JSON-файл; stdout не требуется. Пробелы, отступы и экранирование кириллицы в JSON на оценку не влияют. |

**Ограничения.** Файл существует, UTF-8; name — строка, 0 ≤ volume ≤ 100.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>settings.json: {"name":"Аня","volume":20}<br>Ввод: 0</pre> | <pre>settings.json: {"name":"Аня","volume":0}</pre> |
| <pre>settings.json: {"name":"Ян","volume":0}<br>Ввод: 100</pre> | <pre>settings.json: {"name":"Ян","volume":100}</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9e08f582c8ce93d1','files-csv-json',NULL,NULL,'Список учеников в CSV · по выбору','code','**Сюжет.** Учитель переносит список записей в табличный файл.

**Условие.** save_students(records) записывает students.csv с заголовком name,score, затем читает файл через DictReader и возвращает восстановленный список словарей с целым score.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Аргумент — список словарей с name (строка) и score (целое). | CSV в UTF-8 и возвращаемый список, равный входному по содержимому. |

**Ограничения.** До 30 записей; 0 ≤ score ≤ 100; имена непустые, до 40 символов.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>save_students([{''name'':''Аня'',''score'':5}])</pre> | <pre>[{''name'': ''Аня'', ''score'': 5}]</pre> |
| <pre>save_students([])</pre> | <pre>[]; файл содержит только заголовок name,score</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6d11839289ecf59a','files-csv-json',NULL,NULL,'Список дел между запусками · по выбору','code','**Сюжет.** Программа добавляет новую задачу к ранее сохранённым.

**Условие.** Прочитайте tasks.json как список строк, добавьте задачу из stdin и сохраните. Если файла нет, начните с пустого списка.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Необязательный tasks.json; одна непустая строка stdin — новое дело. | Обновлённый JSON-массив в файле; stdout — количество задач после добавления. |

**Ограничения.** Существующий JSON корректен; до 100 прежних строк. Пустой по содержимому файл не гарантируется корректным JSON и не входит в допустимый ввод.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>tasks.json: ["читать"]<br>Ввод: писать</pre> | <pre>2; файл: ["читать", "писать"]</pre> |
| <pre>Файла нет<br>Ввод: читать</pre> | <pre>1; файл: ["читать"]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-01b26d1315e19df4','files-csv-json',NULL,NULL,'Каталог по автору · по выбору','code','**Сюжет.** Читатель ищет книги конкретного автора в сохранённом каталоге.

**Условие.** В books.json лежит список объектов с title, author, year. Выведите названия книг, у которых author в точности совпадает с введённой строкой.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Существующий JSON-файл и строка автора в stdin. | Названия в порядке файла; если совпадений нет — «Не найдено». |

**Ограничения.** До 50 книг; названия/авторы непустые; регистр важен.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>books.json: [{"title":"Атлас","author":"Ли","year":2020}]<br>Ввод: Ли</pre> | <pre>Атлас</pre> |
| <pre>books.json: []<br>Ввод: Ли</pre> | <pre>Не найдено</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-183f28275e3e37bb','project-structure',NULL,NULL,'Мини-практика: разделим викторину','code','1. В `questions.py` создай функцию, которая возвращает вопрос и ответ.
2. В `main.py` импортируй её.
3. Вызови `main()` только в блоке `if __name__ == "__main__":`.

Пока можно потренироваться на двух файлах рядом, как в примере выше. Структуру пакета попробуй создать в отдельной папке проекта.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4b732f5cf385aca0','project-structure',NULL,NULL,'Общий инструмент текста · обязательная','code','**Сюжет.** Две программы должны пользоваться одной функцией обработки текста.

**Условие.** Создайте text_tools.py с upper_text(text), возвращающей текст в верхнем регистре. В main.py прочитайте строку, импортируйте функцию и выведите результат.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| stdin: одна строка. Оба файла находятся в одной папке; запуск python main.py из неё. | Одна строка; при импорте text_tools постороннего вывода нет. |

**Ограничения.** До 80 символов; Python 3; сторонних пакетов нет.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>кот</pre> | <pre>КОТ</pre> |
| <pre>PyThOn</pre> | <pre>PYTHON</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8d6111f249f9b03a','project-structure',NULL,NULL,'Запуск и импорт · обязательная','code','**Сюжет.** Вспомогательный модуль не должен запускать диалог при импорте.

**Условие.** В greeting.py определите main(), печатающую «Готово». Вызывайте её только под защитой __name__. При обычном import greeting вывода нет.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна из команд в таблице; запуск из папки файла. | Результат команды в stdout. |

**Ограничения.** Никакого stdin и установки пакетов не требуется.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>python greeting.py</pre> | <pre>Готово</pre> |
| <pre>python -c "import greeting"</pre> | <em>Нет вывода</em> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0b1ce5cf6112fae7','project-structure',NULL,NULL,'Изолированная мастерская · обязательная','code','**Сюжет.** Для учебного проекта нужно отдельное окружение, чтобы зависимости не смешивались.

**Условие.** Создайте .venv через venv. Его интерпретатором проверьте версию Python и pip. В check_env.py выведите, различаются ли sys.prefix и sys.base_prefix. Справка: после import sys поле sys.prefix содержит путь текущего интерпретатора, а sys.base_prefix — базового, на основе которого создано окружение. Сохраните команды запуска в Markdown-ячейке.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Рабочая папка и выбранный локальный Python; стандартный ввод не используется. | Папка .venv; вывод проверки из неё — True. Версии Python/pip фиксируются фактически установленными, универсального номера нет. |

**Ограничения.** Не помещайте .venv в сдаваемый архив. Команды активации зависят от ОС; используйте руководство урока.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>.venv/bin/python check_env.py (macOS/Linux)</pre> | <pre>True</pre> |
| <pre>.venv\Scripts\python.exe check_env.py (Windows)</pre> | <pre>True</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9280c5228b3137a1','project-structure',NULL,NULL,'Касса из модулей · повторение','code','**Сюжет.** Кассир хочет менять формат вывода отдельно от расчёта.

**Условие.** В pricing.py создайте total_cost(price, count), возвращающую произведение. В main.py организуйте чтение двух чисел и печать результата; pricing.py не читает input и не печатает.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Два целых числа stdin: цена, затем количество. Запуск python main.py из папки проекта. | Одно целое число. |

**Ограничения.** 0 ≤ price,count ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>7<br>3</pre> | <pre>21</pre> |
| <pre>0<br>4</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ff8817c0819d1472','project-structure',NULL,NULL,'Викторина как пакет · по выбору','code','**Сюжет.** Учебную викторину запускают из корня проекта одинаковой командой.

**Условие.** Создайте пакет quiz с __init__.py, data.py (вопрос и ответ 4), logic.py (проверка ответа) и main.py (ввод/вывод). Команда запуска: python -m quiz.main. Вопрос можно хранить, но при точной проверке печатайте только итог.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Одна строка ответа stdin. | «Верно» либо «Неверно». Сдайте файлы пакета и README с командой запуска. |

**Ограничения.** Ответ сравнивается после strip; правильная строка «4»; пустой ответ допустим. Импорт модулей не запускает ввод.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>4</pre> | <pre>Верно</pre> |
| <pre>5</pre> | <pre>Неверно</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4eb7c0945335d378','project-structure',NULL,NULL,'Воспроизводимое окружение · по выбору','code','**Сюжет.** Другому ученику нужно повторить окружение с уже изученным пакетом requests.

**Условие.** В отдельном окружении установите requests, сохраните зависимости через pip freeze в requirements.txt. Создайте второе окружение и установите файл через pip install -r. В обоих средах проверьте импорт и совпадение requests.__version__.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Команды терминала и requirements.txt, созданный первым окружением; stdin отсутствует. | Два успешных импорта и одинаковая версия requests. В таблице критерии проверки, а не буквальный вывод с выдуманным номером версии. |

**Ограничения.** Задание дополнительное; для установки нужен доступ к индексу пакетов. Используйте python -m pip соответствующего окружения. Версию не задавайте наугад — сохраните установленную.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>Импорт requests в первом окружении</pre> | <pre>Импорт успешен; номер версии записан в отчёте</pre> |
| <pre>Импорт requests во втором окружении после установки requirements.txt</pre> | <pre>Импорт успешен; версия равна версии первого окружения</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b6c7d8b3fb88a566','command-line-git',NULL,NULL,'Проверь обработку ожидаемых ошибок','code','Попробуй указать отсутствующий файл и значение `--top 0`. Программа должна объяснить проблему в сообщении командной строки и завершиться ненулевым кодом, без длинного traceback. В примере это делает `parser.error(...)`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-22c095cf48772a98','command-line-git',NULL,NULL,'Добавь фильтр минимальной длины','code','Добавь параметр `--min-length N`: выводи только слова длиной не меньше N. Раздели чтение файла, подсчёт и печать отчёта на функции. Проверь пустой файл, файл с кириллицей, отсутствующий файл и минимальную длину больше всех слов. Не меняй исходный файл.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-80002be3a6cf18ad','command-line-git',NULL,NULL,'Учебный проект в Git','code','Git хранит историю изменений. Для упражнений создай отдельную папку `git-practice`, чтобы команды не затронули другие проекты. Внутри неё создай `notes.txt`, затем выполни:

```text
git init
git status
git add notes.txt
git commit -m "Добавить заметки"
```

Измени строку в `notes.txt` и посмотри разницу:

```text
git diff
git status
```

Сохрани изменение новым коммитом, затем посмотри историю:

```text
git add notes.txt
git commit -m "Уточнить заметки"
git log --oneline
```

- `git status` показывает файлы, которые изменились или ещё не добавлены.
- `git diff` показывает незакоммиченные изменения в отслеживаемых файлах.
- `git add` выбирает изменения для следующего коммита.
- `git commit` сохраняет локальную точку истории.
- `git log` показывает сохранённые точки.

Перед `git restore` проверь `git status` и `git diff`: эта команда отбрасывает незакоммиченные изменения файла. Для первого знакомства восстановление не требуется; проще отменить эксперимент вручную.

### Что сдать

Файл с добавленным параметром `--min-length`, вывод запуска с `--help`, один обычный запуск и сообщение об ошибке для отсутствующего файла. Для Git — список двух коммитов и краткое объяснение, что показывают `status`, `diff` и `log`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-87204ce59f8390e4','testing-quality',NULL,NULL,'Добавь проверку двух последовательных вызовов with_item([], ...).','code','Добавь проверку двух последовательных вызовов `with_item([], ...)`. Затем проверь свою функцию с аргументом по умолчанию из урока о функциях. Такие проверки ловят общий список, который незаметно сохраняется между вызовами.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ff9823937cdf75f2','testing-quality',NULL,NULL,'Задание 1. Осмысленные имена','code','Переименуй переменные `x`, `y` и `z` в примере так, чтобы было ясно, что он считает.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f4862af2149f5570','testing-quality',NULL,NULL,'Задание 2. Небольшие функции','code','Раздели программу на две функции: одну для вычисления суммы покупок, другую для применения скидки. Функции должны возвращать результат, а не печатать его.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f72fe5118efb5ceb','testing-quality',NULL,NULL,'Задание 3. Автоматические тесты','code','Напиши функцию `is_adult(age)`, которая возвращает `True`, если возраст не меньше 18, и `False` иначе. Создай для неё класс `TestIsAdult` с тестами для возраста 18, 17 и 0.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b2856b0c651df683','testing-quality',NULL,NULL,'Лидер команды · обязательная','code','**Сюжет.** Тренер проверяет функцию выбора лучшего результата.

**Условие.** largest(values) возвращает максимум непустого списка. Для пустого поднимает ValueError с текстом «Нет результатов». Подготовьте unittest-тесты для обычного, одноэлементного, отрицательного и пустого списка.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список целых чисел — аргумент. | Возвращаемое число либо указанное исключение. Тесты проверяют требование независимо от реализации. |

**Ограничения.** До 100 элементов, каждое от −1000 до 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>largest([-5, -2])</pre> | <pre>-2</pre> |
| <pre>largest([])</pre> | <pre>ValueError: Нет результатов</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-43274685a467d577','testing-quality',NULL,NULL,'Проверка парных упаковок · обязательная','code','**Сюжет.** Касса тестирует определение чётного количества.

**Условие.** is_even(n) возвращает логическое значение чётности. Напишите независимые тесты для положительного чётного, нечётного, отрицательного и нуля.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Целый аргумент n. | True или False, не строка. |

**Ограничения.** −1000 ≤ n ≤ 1000.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>is_even(0)</pre> | <pre>True</pre> |
| <pre>is_even(-3)</pre> | <pre>False</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f263576bb918e46b','testing-quality',NULL,NULL,'Средняя оценка · обязательная','code','**Сюжет.** Пустой журнал не должен незаметно превращаться в нулевую среднюю.

**Условие.** average(scores) возвращает среднее непустого списка и поднимает ValueError("Нет оценок") для пустого. Добавьте тесты, включая список из одного элемента.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список целых оценок. | float либо указанное исключение; в тесте дробного среднего используйте подходящее сравнение чисел. |

**Ограничения.** До 30 оценок от 2 до 5.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>average([3, 4, 5])</pre> | <pre>4.0</pre> |
| <pre>average([])</pre> | <pre>ValueError: Нет оценок</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-50d7648e2d8bf384','testing-quality',NULL,NULL,'Расчёт скидки · повторение','code','**Сюжет.** Магазин допускает скидку от 0 до 100 процентов и неотрицательную цену.

**Условие.** final_price(price, discount) возвращает целую цену после скидки. Если цена отрицательная или discount вне диапазона, поднимает ValueError("Неверные данные"). Напишите тесты для 0%, 50%, 100%, нулевой цены и обоих видов ошибки.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Целые price и discount — аргументы. | Целое число либо указанное исключение. |

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

**Условие.** total(prices) возвращает сумму; receipt(name, prices) возвращает «ИМЯ: СУММА ₽». Разделите расчёт и форматирование; дайте переменным понятные имена. Тестируйте обе функции, исходный список не меняйте.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Имя и список целых цен — аргументы receipt; список — аргумент total. | Число для total и строка для receipt. |

**Ограничения.** До 50 цен от 0 до 10000; имя непустое.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>receipt(''Аня'', [100, 50])</pre> | <pre>''Аня: 150 ₽''</pre> |
| <pre>total([])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-034dd2c2d9d6c064','testing-quality',NULL,NULL,'Независимая копия измерений · по выбору','code','**Сюжет.** Аналитик хочет проверить, что обработка не испортила исходные данные.

**Условие.** positive_copy(values) возвращает новый список положительных элементов в прежнем порядке. Напишите тесты значения результата, неизменности входного списка и отдельности результата; проверьте два последовательных вызова.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Список целых чисел. | Новый список. Даже при пустом входе результат — отдельный объект. |

**Ограничения.** До 30 элементов от −100 до 100; повторы сохраняются.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>positive_copy([0, -1, 2, 2])</pre> | <pre>[2, 2]</pre> |
| <pre>positive_copy([])</pre> | <pre>[]</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cbba48144f9e4d76','testing-quality',NULL,NULL,'Защита небольшого проекта · по выбору','code','**Сюжет.** Команда готовит защиту консольной викторины.

**Условие.** В своём проекте выделите normalize_answer(text), возвращающую strip/lower, и count_correct(answers, expected), считающую точные совпадения после нормализации. Для каждой функции напишите минимум обычный и граничный unittest-тест.

**Формат данных**

| Входные данные | Выходные данные |
|---|---|
| Строка для первой функции; два списка строк равной длины для второй. | Возвращаемая строка или целое количество. Сдайте проект и команду запуска тестов. |

**Ограничения.** До 20 ответов, до 80 символов в строке; пустые строки допустимы.

**Примеры**

| Входные данные | Выходные данные |
|---|---|
| <pre>normalize_answer('' Да '')</pre> | <pre>''да''</pre> |
| <pre>count_correct([''ДА'', ''нет''], [''да'', ''да''])</pre> | <pre>1</pre> |
| <pre>count_correct([], [])</pre> | <pre>0</pre> |

**Источник.** Авторская задача курса.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-effb843a3a2b8f63','turtle',NULL,NULL,'Задача 1. Домик','code','Нарисуй домик: квадратный корпус, треугольную крышу и дверь. Используй `for`, `forward`, `left` или `right`, а для двери — `penup` и `goto`. Раскрась крышу и дверь.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9ada6475dedff376','turtle',NULL,NULL,'Задача 2. Светофор','code','Нарисуй три цветных круга вертикально: красный, жёлтый и зелёный. Используй `dot`, переменную для координаты `y` и цикл, если получится.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fa1f4b474448af9d','turtle',NULL,NULL,'Задача 3. Солнечный узор','code','Нарисуй солнце и 12 лучей вокруг него. Используй цикл, `forward`, `backward` и поворот на `30` градусов. Попробуй выбрать цвет и толщину линий самостоятельно.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1076b3315d8273b7','doodle-jump',NULL,NULL,'Измени цвета фона, героя и платформ. Объясни, какая строка рисует каждый объект','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Базовые.

1. Измени цвета фона, героя и платформ. Объясни, какая строка рисует каждый объект.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-73da5b13dfa44892','doodle-jump',NULL,NULL,'Сделай платформы шире. Проверь, почему генератор всё ещё удерживает их в окне','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Базовые.

2. Сделай платформы шире. Проверь, почему генератор всё ещё удерживает их в окне.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f5e1066c01a85575','doodle-jump',NULL,NULL,'Добавь клавишу Q для выхода, сохранив Escape и крестик','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Базовые.

3. Добавь клавишу Q для выхода, сохранив Escape и крестик.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-519659a3bb76e949','doodle-jump',NULL,NULL,'Выведи счёт не сверху слева, а сверху справа. Используй `get_rect(topright=(WIDTH - 12, 12))`','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Базовые.

4. Выведи счёт не сверху слева, а сверху справа. Используй `get_rect(topright=(WIDTH - 12, 12))`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-7930cce3e94928c8','doodle-jump',NULL,NULL,'Измени число пикселей за один балл с 10 на 20. Как изменится результат одного и того же подъёма?','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Базовые.

5. Измени число пикселей за один балл с 10 на 20. Как изменится результат одного и того же подъёма?',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c26b9efa1dceabf3','doodle-jump',NULL,NULL,'Сделай два режима скорости героя. Выбор должен происходить до начала попытки, чтобы случайно не менять её в полёте','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Средние.

6. Сделай два режима скорости героя. Выбор должен происходить до начала попытки, чтобы случайно не менять её в полёте.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-abf31e019b269182','doodle-jump',NULL,NULL,'Добавь надпись `"Press R"` в экран проигрыша и объясни, почему текст создаётся методом `render`','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Средние.

7. Добавь надпись `"Press R"` в экран проигрыша и объясни, почему текст создаётся методом `render`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d45a555acd53d703','doodle-jump',NULL,NULL,'Сделай воспроизводимый учебный маршрут через `random.seed` и проверь один сложный прыжок несколько раз','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Средние.

8. Сделай воспроизводимый учебный маршрут через `random.seed` и проверь один сложный прыжок несколько раз.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ecacdfe4d7a0ceb6','doodle-jump',NULL,NULL,'Вместо остановки у боковой границы придумай переход на противоположный край. Согласуй дробную x и Rect.x, как уже делал ','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Средние.

9. Вместо остановки у боковой границы придумай переход на противоположный край. Согласуй дробную x и Rect.x, как уже делал с y. Реши, когда герой должен появляться: при выходе центра или всего прямоугольника.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-abc3e68207004b1b','doodle-jump',NULL,NULL,'Движущиеся платформы: сначала одна платформа с собственной горизонтальной скоростью, затем список таких объектов. Придёт','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Для продолжения курса.

10. Движущиеся платформы: сначала одна платформа с собственной горизонтальной скоростью, затем список таких объектов. Придётся сравнивать их положение с игроком в одном и том же кадре.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-aebd68fe924b69f1','doodle-jump',NULL,NULL,'Хрупкие платформы: хранить признак типа, после первого отскока удалять платформу через новый список. Потребуется следить','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Для продолжения курса.

11. Хрупкие платформы: хранить признак типа, после первого отскока удалять платформу через новый список. Потребуется следить, чтобы маршрут не становился невозможным.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-16b3241565ecac0a','doodle-jump',NULL,NULL,'Постоянный рекорд: прочитать число из файла при запуске и записать при завершении; отдельно обработать отсутствие или по','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Для продолжения курса.

12. Постоянный рекорд: прочитать число из файла при запуске и записать при завершении; отдельно обработать отсутствие или повреждение файла.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c6d7a701bb71dce7','doodle-jump',NULL,NULL,'Классы Player, Platform и Game: переходить к ним после того, как ученик может объяснить процедурную версию. Класс должен','code','Начинай с задач, которые меняют одно правило. После каждого изменения объясняй, почему оно работает.

Раздел: Для продолжения курса.

13. Классы Player, Platform и Game: переходить к ним после того, как ученик может объяснить процедурную версию. Класс должен объединять уже знакомые данные и действия, а не скрывать непонятный алгоритм.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d6b275cd10ef2bac','doodle-jump',NULL,NULL,'Картинка героя','code','Сначала закончи механику. Затем можно заменить зелёный прямоугольник PNG-изображением.

1. Положи собственную картинку `player.png` рядом с `main.py`.
2. Добавь `from pathlib import Path`.
3. После создания окна, **до цикла**, загрузи и подготовь изображение:

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

`Path(__file__)` позволяет искать файл относительно программы, а не текущего каталога терминала. `convert_alpha()` сохраняет прозрачные области и вызывается после открытия окна. `min` выбирает масштаб, при котором картинка помещается в прямоугольник целиком и не искажается.

4. В части рисования замени строку с зелёным прямоугольником на:

```python
image_rect = player_image.get_rect(midbottom=player.midbottom)
screen.blit(player_image, image_rect)
```

Физика по-прежнему использует `player`. Картинка может быть уже него — это осознанное упрощение: область столкновения остаётся прямоугольной и может отличаться от видимого контура. Не загружай файл каждый кадр.

PNG-иллюстрации этого урока показывают схемы, поэтому использовать их целиком как картинку героя не нужно.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-316217ff8d2b7f26','variables-print-input',NULL,NULL,'Выведите текст Я учусь Python!.','code','Выведите текст `Я учусь Python!`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-eae9733325dbc933','variables-print-input',NULL,NULL,'Сохраните название животного в переменную pet.','code','Сохраните название животного в переменную `pet`. Выведите текст `Мой любимец:` и значение переменной.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b9f5665771e7c8a5','variables-print-input',NULL,NULL,'Присвойте points значение 2 и выведите его.','code','Присвойте `points` значение `2` и выведите его. Затем присвойте значение `6` и снова выведите его.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-bbad8676d98f5c37','variables-print-input',NULL,NULL,'Выведите слова я, учу, Python.','code','Выведите слова `я`, `учу`, `Python`. Используйте разделитель ` -> `.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-68f782e6d2a0d60f','variables-print-input',NULL,NULL,'Что выведет print("4" + "5")?','text','Что выведет `print("4" + "5")`? Что выведет `print(4 + 5)`?',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-9f9c6327fc518eac','variables-print-input',NULL,NULL,'Создайте переменные a = 17 и b = 5.','code','Создайте переменные `a = 17` и `b = 5`. Выведите `a // b` и `a % b`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5556656014927744','variables-print-input',NULL,NULL,'Создайте переменные с именем и любимым цветом.','code','Создайте переменные с именем и любимым цветом. Выведите их одной командой `print()`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0fed3c6fdad46386','variables-print-input',NULL,NULL,'Получите целое число с помощью input().','code','Получите целое число с помощью `input()`. Выведите это число, умноженное на 2.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5cf9e3d76d8e85c2','variables-print-input',NULL,NULL,'Задание 1. Выведи фразу','code','Напиши программу, которая выводит на экран одну фразу: `Я учусь программировать!`.

**Ввод:** не нужен.

**Пример вывода:**

```text
Я учусь программировать!
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0ab34a578a392f4c','variables-print-input',NULL,NULL,'Задание 2. Используй переменные','code','1. Создай переменную `name` и сохрани в ней текст `Аня`.
2. Создай переменную `age` и сохрани в ней число `9`.
3. Выведи имя и возраст двумя командами `print()`.

**Ввод:** не нужен. Используй значения `Аня` и `9` из задания.

**Пример вывода:**

```text
Её зовут Аня
Ей 9 лет
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f86a421ac3d17063','variables-print-input',NULL,NULL,'Задание 3. Измени значение переменной','code','1. Сохрани число `3` в переменную `points` и выведи его.
2. Потом сохрани число `8` в эту же переменную и выведи новое значение.

**Ввод:** не нужен.

**Пример вывода:**

```text
3
8
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d1690c7e7d3cb454','variables-print-input',NULL,NULL,'Задание 4. Поставь разделитель','code','Одной командой `print()` выведи три слова: `красный`, `зелёный`, `синий`.

Поставь между словами разделитель ` | `. Для этого используй настройку `sep`.

**Ввод:** не нужен.

**Пример вывода:**

```text
красный | зелёный | синий
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-995a3b55d8a3ac84','variables-print-input',NULL,NULL,'Задание 5. Используй `end`','code','Напиши две команды `print()`.

- Первая выводит `Привет,`.
- Вторая выводит `мир!`.
- Оба слова должны оказаться на одной строке, с одним пробелом между ними.

Используй настройку `end`.

**Ввод:** не нужен.

**Пример вывода:**

```text
Привет, мир!
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-5f7d832e70fa2ced','variables-print-input',NULL,NULL,'Задание 6. Спроси имя','code','1. С помощью `input()` спроси: `Как тебя зовут? `.
2. Сохрани ответ в переменную `name`.
3. Выведи приветствие: `Привет, имя!`.

**Ввод:** после запуска введи `Аня` и нажми Enter.

**Пример вывода после ввода:**

```text
Привет, Аня!
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0b672f89cfadaf80','variables-print-input',NULL,NULL,'Задание 7. Удвой число','code','1. Спроси целое число с помощью `input()`.
2. Преврати ответ в число с помощью `int()`.
3. Умножь число на `2`.
4. Выведи ответ вместе с текстом `Удвоенное число:`.

**Ввод:** после запуска введи `7` и нажми Enter.

**Пример вывода после ввода:**

```text
Удвоенное число: 14
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-be2eb457790974c4','variables-print-input',NULL,NULL,'Задание 8. Сложи два числа','code','1. Спроси первое целое число и сохрани его.
2. Спроси второе целое число и сохрани его.
3. Сложи числа.
4. Выведи сумму вместе с текстом `Сумма:`.

Оба ответа нужно превратить из текста в числа с помощью `int()`.

**Ввод:** сначала введи `12`, нажми Enter. Затем введи `5` и нажми Enter.

**Пример вывода после двух вводов:**

```text
Сумма: 17
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dc86612076a74341','variables-print-input',NULL,NULL,'Задание 9. Сравни текст и числа','code','Напиши две команды `print()`:

1. В первой сложи тексты `"4"` и `"5"`.
2. Во второй сложи числа `4` и `5`.

Добавь подписи `Тексты:` и `Числа:`.

**Ввод:** не нужен.

**Пример вывода:**

```text
Тексты: 45
Числа: 9
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-b6a3069634c9a73e','variables-print-input',NULL,NULL,'Задание 10. Найди целое деление и остаток','code','Создай переменные `a` и `b`. Сохрани в `a` число `17`, а в `b` — число `5`.

Выведи сначала результат `a // b`, а затем результат `a % b`.

**Ввод:** не нужен.

**Пример вывода:**

```text
3
2
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a57be68e1f4f5451','variables-print-input',NULL,NULL,'Задание 11. Спроси имя и любимый цвет','code','1. Спроси имя и сохрани ответ в переменную `name`.
2. Спроси любимый цвет и сохрани ответ в переменную `color`.
3. Выведи предложение: `Имя любит цвет цвет.` Подставь ответы вместо слов `Имя` и `цвет`.

**Ввод:** сначала введи `Миша`, нажми Enter. Затем введи `синий` и нажми Enter.

**Пример вывода после двух вводов:**

```text
Миша любит синий цвет.
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-f42e9c6561b61c82','variables-print-input',NULL,NULL,'Задание 12. Выведи текст в три строки','code','Выведи слово `Python` три раза: каждое слово должно быть на отдельной строке.

Используй `\n` или три команды `print()`.

**Ввод:** не нужен.

**Пример вывода:**

```text
Python
Python
Python
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ca79e0d369fdaa87','conditions-bool-if',NULL,NULL,'Задание 1. Проверь типы значений','code','Напиши программу, которая показывает типы трёх значений: числа `7`, текста `"Привет"` и результата сравнения `7 > 3`. Используй `type()`.

**Ввод:** не нужен.

**Пример вывода:**

```text
<class ''int''>
<class ''str''>
<class ''bool''>
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0446538bc2905232','conditions-bool-if',NULL,NULL,'Задание 2. Сравни числа','code','Создай переменные `a = 5` и `b = 5`. Покажи результаты четырёх сравнений: `a < b`, `a <= b`, `a == b`, `a != b`.

**Ввод:** не нужен.

**Пример вывода:**

```text
False
True
True
False
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-eb3e6eb66defbd2c','conditions-bool-if',NULL,NULL,'Задание 3. Отличи `=` от `==`','code','Сохрани число `4` в переменную `number`. Покажи само число. Затем проверь, равно ли оно `4`, и равно ли оно `7`.

**Ввод:** не нужен.

**Пример вывода:**

```text
4
True
False
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d4cc29ec35df10de','conditions-bool-if',NULL,NULL,'Задание 4. Проверь числа с помощью `bool()`','code','Покажи результат `bool()` для чисел `0`, `1`, `-2` и `2.5`.

**Ввод:** не нужен.

**Пример вывода:**

```text
False
True
True
True
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c58e60c34d64e0d7','conditions-bool-if',NULL,NULL,'Задание 5. Проверь текст с помощью `bool()`','code','Покажи результат `bool()` для пустого текста `""`, одного пробела `" "`, текста `"0"` и слова `"Python"`.

**Ввод:** не нужен.

**Пример вывода:**

```text
False
True
True
True
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-99f5559c5631ced2','conditions-bool-if',NULL,NULL,'Задание 6. Определи правило входа по возрасту','code','Напиши программу с переменной `age`. Используй `if`, `elif` и `else`:

- меньше 12 лет — `Вход запрещён`;
- меньше 16 лет — `Вход разрешён с родителем`;
- до 18 лет включительно — `Вход разрешён до 19:00`;
- старше 18 лет — `Вход разрешён`.

Сначала сохрани в `age` значение `15`. После запуска программа должна вывести результат для 15 лет.

**Ввод:** не нужен, возраст уже записан в программе.

**Пример вывода:**

```text
Вход разрешён с родителем
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0c837054f3da792f','conditions-bool-if',NULL,NULL,'Задание 7. Проверь другой возраст','code','Скопируй в ячейку ниже свою программу из задания 6. Измени значение `age` на `18`. Запусти программу ещё раз.

**Ввод:** не нужен. Используй значение `18`.

**Пример вывода:**

```text
Вход разрешён до 19:00
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-46de4ddb4a84d09d','conditions-bool-if',NULL,NULL,'Задание 8. Проверь возраст 19 лет','code','Скопируй в ячейку ниже свою программу из задания 6. Измени значение `age` на `19`. Проверь, что выполняется ветка `else`.

**Ввод:** не нужен. Используй значение `19`.

**Пример вывода:**

```text
Вход разрешён
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-eda3affd67a297c7','conditions-bool-if',NULL,NULL,'Задание 9. Используй `and`','code','Получи два целых числа с помощью `input()` и `int()`. Если оба числа больше нуля, выведи `Оба числа положительные`. Иначе выведи `Не оба числа положительные`.

**Ввод:** сначала введи `4`, затем `6`.

**Пример вывода после ввода:**

```text
Оба числа положительные
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4e67ec4a21ed2256','conditions-bool-if',NULL,NULL,'Задание 10. Используй `or` и учти ноль','code','Получи два целых числа. Проверь их в таком порядке:

- если оба больше нуля, выведи `Оба числа положительные`;
- иначе, если хотя бы одно меньше нуля, выведи `Есть отрицательное число`;
- иначе выведи `Отрицательных чисел нет; есть ноль`.

**Ввод:** сначала введи `-2`, затем `0`.

**Пример вывода после ввода:**

```text
Есть отрицательное число
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1f950c76011440bc','conditions-bool-if',NULL,NULL,'Задание 11. Проверь резервуар с водой','code','Получи количество литров через `input()` и преобразуй ответ в число с помощью `float()`.

- если количество равно нулю, выведи `Пусто`;
- иначе выведи `Вода есть`.

Считай, что вводится ноль или положительное число.

**Ввод:** введи `0`.

**Пример вывода после ввода:**

```text
Пусто
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-baa0e7a52c64354a','conditions-bool-if',NULL,NULL,'Задание 12. Проверь непустой резервуар','code','Используй ту же программу, что в задании 11. Проверь, что она выводит правильное сообщение, если воды больше нуля.

**Ввод:** введи `2.5`.

**Пример вывода после ввода:**

```text
Вода есть
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6ace98c3448520d3','while-loop-conditions',NULL,NULL,'Задание 1. Выведи числа от 1 до 4','code','Создай переменную `number` со значением `1`. Используй `while`, чтобы вывести числа от 1 до 4, каждое с новой строки. После каждого вывода увеличивай `number` на 1. После цикла выведи `Готово`.

**Ввод:** не нужен.

**Пример вывода:**

```text
1
2
3
4
Готово
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-6ed35146bfb37592','while-loop-conditions',NULL,NULL,'Задание 2. Сделай обратный отсчёт','code','Спроси целое число `n`. Выводи числа от `n` до `1`, уменьшая число на 1. После цикла выведи `Старт!`.

**Ввод нужен:** введи `3`.

**Пример вывода:**

```text
3
2
1
Старт!
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-24d9694d41e4ad5b','while-loop-conditions',NULL,NULL,'Задание 3. Проверь ноль повторов','code','Создай `number = 8`. Напиши цикл `while number < 5`, который выводит `Внутри цикла`. После цикла выведи `После цикла`.

Условие сразу неверно. Проверь, что тело цикла не выполняется.

**Ввод:** не нужен.

**Пример вывода:**

```text
После цикла
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ef9babc627950e54','while-loop-conditions',NULL,NULL,'Задание 4. Посчитай сумму от 1 до n','code','Спроси целое число `n`. С помощью `while` сложи все числа от 1 до `n` включительно. Сохраняй сумму в переменную `total`. После цикла выведи `Сумма:` и ответ.

**Ввод нужен:** введи `4`.

**Пример вывода:**

```text
Сумма: 10
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d389981ecf2fa35c','while-loop-conditions',NULL,NULL,'Задание 5. Выведи нечётные числа','code','Используй `while`, чтобы вывести числа `1`, `3`, `5`, `7` по одному на строке. Начни с 1 и увеличивай переменную на 2 после каждого повтора.

**Ввод:** не нужен.

**Пример вывода:**

```text
1
3
5
7
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-70c228c8ca9bf5c6','while-loop-conditions',NULL,NULL,'Задание 6. Повторяй ввод, пока не будет нужное слово','code','Спроси слово `стоп`. Пока ответ не равен слову `стоп`, выводи `Неверное слово` и спрашивай снова. Когда ответ станет `стоп`, выйди из цикла и выведи `Готово`.

Сравнение текста учитывает большие и маленькие буквы.

**Ввод нужен:** введи по очереди `начать`, `СТОП`, `стоп`.

**Пример вывода:**

```text
Неверное слово
Неверное слово
Готово
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c9c2255429137a05','while-loop-conditions',NULL,NULL,'Задание 7. Проверь число от 1 до 5','code','Спроси целое число. Пока оно меньше 1 **или** больше 5, выведи `Число вне диапазона` и попроси ввести число снова. Когда число попадёт в диапазон, выведи `Принято:` и это число.

**Ввод нужен:** введи по очереди `0`, `6`, `4`.

**Пример вывода:**

```text
Число вне диапазона
Число вне диапазона
Принято: 4
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-dcf82a5f4b07aeb3','while-loop-conditions',NULL,NULL,'Задание 8. Используй `if` внутри `while`','code','Спроси целое число. Пока число не равно нулю:

- если число больше нуля, выведи `Положительное`;
- иначе выведи `Отрицательное`;
- затем спроси следующее число.

Когда введён ноль, закончи цикл и выведи `Готово`.

**Ввод нужен:** введи по очереди `4`, `-2`, `0`.

**Пример вывода:**

```text
Положительное
Отрицательное
Готово
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-aed9abdf9d10b155','while-loop-conditions',NULL,NULL,'Задание 9. Используй `if`, `elif` и `else` внутри цикла','code','Программа должна три раза спросить оценку от 0 до 100. Для каждой оценки выведи:

- `Отлично`, если оценка не меньше 90;
- `Хорошо`, если оценка не меньше 70;
- `Нужно повторить` во всех остальных случаях.

Используй переменную-счётчик и цикл `while`. Внутри него размести `if / elif / else`.

**Ввод нужен:** введи по очереди `95`, `75`, `60`.

**Пример вывода:**

```text
Отлично
Хорошо
Нужно повторить
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-ce2ea5339c5bd5df','while-loop-conditions',NULL,NULL,'Задание 10. Сделай игру «Угадай число»','code','Загаданное число уже записано в программе: `secret = 7`.

Спроси догадку. Пока она не равна загаданному числу:

- если догадка меньше числа, выведи `Моё число больше`;
- если догадка больше числа, выведи `Моё число меньше`;
- спроси новую догадку и увеличь счётчик попыток.

Когда число угадано, выведи `Верно! Попыток:` и количество попыток.

**Ввод нужен:** введи по очереди `3`, `9`, `7`.

**Пример вывода:**

```text
Моё число больше
Моё число меньше
Верно! Попыток: 3
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cc095633cfe1495a','while-advanced-practice',NULL,NULL,'Задание 1. Сложи числа до сигнала','code','Вводи целые числа, пока не появится `-1`. Число `-1` — сигнал остановки, в сумму оно не входит. Посчитай количество введённых чисел и их сумму. Выведи оба ответа.

**Ввод нужен:** введи по очереди `4`, `-2`, `7`, `-1`.

**Пример вывода:**

```text
Количество: 3
Сумма: 9
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-0368379b227f0cb2','while-advanced-practice',NULL,NULL,'Задание 2. Посчитай значения в диапазоне','code','Вводи целые числа до сигнала `0`. Ноль в подсчёт не входит. Посчитай, сколько чисел от 10 до 20 включительно.

**Ввод нужен:** введи `5`, `10`, `20`, `22`, `0`.

**Пример вывода:**

```text
Количество: 2
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4244e37ad5e06710','while-advanced-practice',NULL,NULL,'Задание 3. Найди наибольшее число','code','Вводи целые числа до сигнала `-1`. Сигнал не учитывай. Выведи самое большое из введённых чисел. Считай, что до сигнала введено хотя бы одно число.

**Ввод нужен:** введи `4`, `9`, `2`, `-1`.

**Пример вывода:**

```text
Максимум: 9
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-efb0e6db5a7e6670','while-advanced-practice',NULL,NULL,'Задание 4. Найди среднее значение','code','Вводи числа до сигнала `0`. Ноль не включай в расчёт. Найди сумму, количество чисел и среднее значение.

**Ввод нужен:** введи `4`, `6`, `0`.

**Пример вывода:**

```text
Количество: 2
Сумма: 10
Среднее: 5.0
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-655620364433186a','while-advanced-practice',NULL,NULL,'Задание 5. Вычисли факториал','code','Спроси натуральное число `n`. Вычисли произведение чисел от 1 до `n` с помощью `while`. Сохраняй произведение в переменную. Ввод: `5`.

**Ввод нужен:** введи `5`.

**Пример вывода:**

```text
Факториал: 120
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-cf8478341e8b07d9','while-advanced-practice',NULL,NULL,'Задание 6. Посчитай положительные, отрицательные и нули','code','Сначала спроси, сколько чисел будет введено. Затем получи это количество чисел и с помощью `if / elif / else` посчитай, сколько среди них положительных, отрицательных и равных нулю.

**Ввод нужен:** сначала введи количество `5`, затем числа `-3`, `0`, `4`, `5`, `-1` по одному.

**Пример вывода:**

```text
Положительных: 2
Отрицательных: 2
Нулей: 1
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c56fd7864944666b','while-advanced-practice',NULL,NULL,'Задание 7. Сделай игру «Угадай число» со счётчиком','code','Загаданное число в программе — `17`. Спроси догадку. Пока она неверная, сообщай, больше или меньше загаданного числа догадка, и спрашивай снова. Считай количество попыток, включая правильный ответ.

**Ввод нужен:** введи по очереди `10`, `20`, `17`.

**Пример вывода:**

```text
Моё число больше
Моё число меньше
Верно! Попыток: 3
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8f952b58f33b5420','while-advanced-practice',NULL,NULL,'Задание 8. Найди минимальное количество слагаемых','code','Дано целое число `target`. Найди наименьшее `k`, для которого сумма `1 + 2 + ... + k` не меньше `target`. Используй цикл `while`, переменную суммы и счётчик.

**Ввод нужен:** введи `11`.

**Пример вывода:**

```text
Количество чисел: 5
Сумма: 15
```',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-60c744cb819718ad','while-break-continue-range',NULL,NULL,'Задание 1. Выведи числа от 1 до `n`','code','Напиши программу, которая:

1. Просит ввести целое число `n`.
2. Использует `for`, чтобы вывести все числа от 1 до `n` включительно. Каждое число должно быть на новой строке.
3. После чисел выводит слово `Готово`.

**Ввод нужен:** введи число `5`.

**Пример вывода:**

```text
1
2
3
4
5
Готово
```

**Подсказка:** ввод целого числа можно записать так: `n = int(input())`. Чтобы `n` попало в цикл, используй границу остановки `n + 1`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-4c8ba450175285b2','while-break-continue-range',NULL,NULL,'Задание 2. Пропускай числа и остановись на восьми','code','Напиши программу, которая:

1. Просит ввести целое число `n`.
2. Проходит циклом `for` по числам от 1 до `n` включительно.
3. Когда число равно 8, заканчивает цикл командой `break`. Число 8 не выводится.
4. Если число делится на 3 без остатка, пропускает только его командой `continue`.
5. Остальные числа выводит, каждое на отдельной строке.
6. После цикла выводит `Проверка завершена`.

**Ввод нужен:** введи `10`.

**Пример вывода:**

```text
1
2
4
5
7
Проверка завершена
```

**Почему получился такой вывод:** число 3 пропустили; число 6 тоже пропустили; на числе 8 остановились. Поэтому 8, 9 и 10 уже не рассматриваются.

**Подсказка:** проверь сначала `number == 8`, затем `number % 3 == 0`.',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-a27f189a47606a85','mixed-lessons',NULL,NULL,'Задание 1. Знакомство','code','Спроси у пользователя:
- имя
- возраст

Выведи одной строкой:

```
Привет, <имя>! Тебе <возраст> лет.
```

**Пример работы программы:**

```
Как тебя зовут? Аня
Сколько тебе лет? 12
Привет, Аня! Тебе 12 лет.
```

---',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-8e96adc410e691c3','mixed-lessons',NULL,NULL,'Задание 2. Повторялка','code','Спроси у пользователя:
- слово
- число `n`

Выведи это слово `n` раз, каждый раз с новой строки.

**Пример:**

```
Введи слово: Python
Сколько раз повторить? 3
Python
Python
Python
```

---',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-d4ce8a9a991de188','mixed-lessons',NULL,NULL,'Задание 3. Линия из символов','code','Спроси у пользователя:
- символ (один знак, например `*` или `#`)
- число `n`

Нарисуй линию из этого символа длиной `n`.

**Пример:**

```
Введи символ: *
Сколько символов? 7
*******
```

> Подсказка: используй `print(symbol, end="")`, чтобы символы шли в одну строку.

---',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-fde0bf18087216ca','mixed-lessons',NULL,NULL,'Задание 4. Нумерованное приветствие','code','Спроси у пользователя:
- имя
- число `n`

Выведи приветствие `n` раз с номером строки:

```
Как тебя зовут? Аня
Сколько раз поздороваться? 3
1. Привет, Аня!
2. Привет, Аня!
3. Привет, Аня!
```

> Подсказка: внутри цикла `for i in range(n)` переменная `i` принимает значения 0, 1, 2... Подумай, как получить 1, 2, 3.

---',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-47bf922a121bc345','mixed-lessons',NULL,NULL,'Задание 5. Мини-таблица умножения','code','Спроси у пользователя число.
Выведи таблицу умножения на это число от 1 до 5.

**Пример:**

```
Введи число: 3
3 x 1 = 3
3 x 2 = 6
3 x 3 = 9
3 x 4 = 12
3 x 5 = 15
```

> Подсказка: используй переменную цикла и `*` для умножения.

---',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-24595c70d7d7e0cc','mixed-lessons',NULL,NULL,'Задание 6. Чётное или нечётное','code','Спроси у пользователя число.
Если оно чётное — выведи `Число чётное`.
Если нечётное — выведи `Число нечётное`.

**Пример 1:**

```
Введи число: 4
Число чётное
```

**Пример 2:**

```
Введи число: 7
Число нечётное
```

> Подсказка: число чётное, если остаток от деления на 2 равен нулю: `number % 2 == 0`.

---',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c24d26c9d27c748a','mixed-lessons',NULL,NULL,'Задание 7. Можно ли получать права','code','Спроси у пользователя возраст.
Если возраст 16 или больше — выведи `Можно получать права`.
Иначе — выведи `Придётся подождать`.

**Пример 1:**

```
Сколько тебе лет? 18
Можно получать права
```

**Пример 2:**

```
Сколько тебе лет? 14
Придётся подождать
```

---',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-1f7be742bd0ad2dc','mixed-lessons',NULL,NULL,'Задание 8. Оценка по баллам','code','Спроси у пользователя количество баллов (от 0 до 100).
Выведи оценку по правилам:

| Баллы       | Оценка                |
|-------------|-----------------------|
| 90 и больше | Отлично               |
| 75–89       | Хорошо                |
| 60–74       | Удовлетворительно     |
| меньше 60   | Неудовлетворительно   |

**Пример:**

```
Сколько баллов? 82
Хорошо
```

> Подсказка: используй `if`, `elif` и `else`.

---',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-760c0ed72e567b4f','mixed-lessons',NULL,NULL,'Задание 9. Только чётные числа','code','Спроси у пользователя число `n`.
С помощью цикла `for` и условия `if` выведи только чётные числа от 1 до `n`.

**Пример:**

```
Введи число: 10
2
4
6
8
10
```

> Подсказка: перебери числа от 1 до n включительно и проверь каждое на чётность.

---',NULL,NULL,NULL);
--> statement-breakpoint
INSERT OR IGNORE INTO assignments (id,topic_id,student_id,lesson_id,title,kind,prompt,options,answer,tests) VALUES ('python-task-c7a006b9731e2a8a','mixed-lessons',NULL,NULL,'Задание 10. Угадай секретное слово (со звёздочкой)','code','Загадай секретное слово, например `"python"`.
Позволь пользователю угадать его за 3 попытки.

Для каждой попытки:
- если слово угадано — выведи `Правильно!` и остановись;
- иначе — выведи `Неправильно, попробуй ещё раз`.

**Пример, если пользователь угадал со второй попытки:**

```
Угадай секретное слово: java
Неправильно, попробуй ещё раз
Угадай секретное слово: python
Правильно!
```

> Подсказка: используй `for` для трёх попыток и `if` для проверки слова. Если слово угадано, используй `break`, чтобы остановить цикл досрочно.

---',NULL,NULL,NULL);
