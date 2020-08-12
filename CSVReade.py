import csv


with open('Test.csv') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    print(csv_reader)
    bottomTitle = list(csv_reader)

courses = bottomTitle[0][1:]
key = bottomTitle[1][1:]
DataList = bottomTitle[2:]
Qnum = 0
values = []

print(key)
print(DataList)




for x in courses:
    values.append(0)

for x in DataList:
    Qnum = 0
    for y in x[1:]:
        if y == key[Qnum]:
            values[Qnum] += 1 
        Qnum  += 1

print(values)